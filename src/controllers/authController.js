import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import UserAuditLog from "../models/userAuditLogModel.js";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/email.js";

const signToken = (id) => {
	return sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

// const createSendToken = (user, statusCode, req, res) => {
// 	const token = signToken(user._id);

// 	res.cookie("jwt", token, {
// 		expires: new Date(
// 			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
// 		),
// 		httpOnly: true,
// 		secure: req.secure || req.headers["x-forwarded-proto"] === "https",
// 	});

// 	// Remove password from output
// 	user.password = undefined;

// 	res.status(statusCode).json({
// 		status: "success",
// 		token,
// 		data: {
// 			user,
// 		},
// 	});
// };

// const auditLog = async (user, task) => {
// 	await UserAuditLog.create({
// 		User: user._id,
// 		userTask: task /*get the signup function name*/,
// 		timestamp: Date.now(),
// 	});
// };

const signup = catchAsync(async (req, res, next) => {
	// const newUser = await User.create(req.body);
	//to fix role:admin security flaw
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: req.body.passwordChangedAt,
		role: req.body.role,
		countryCode: req.body.countryCode,
	});
	//Create user audit log
	const newAuditLog = await UserAuditLog.create({
		User: newUser._id,
		userTask: "Signup",
		timestamp: Date.now(),
	});

	const token = signToken(newUser._id);

	res.status(201).json({
		status: "success",
		token,
		data: {
			user: newUser,
			auditLog: newAuditLog,
		},
	});
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	//1) Check if email and password exist
	if (!email || !password) {
		return next(new AppError("Please provide email and password!", 400));
	}
	//2) Check if user exists && password is correct
	//explicitly select the password, even though in userModel we select:false
	const user = await User.findOne({ email }).select("+password");
	//password is from the input, user.password is from the db after using findOne to get
	//if !user is true, won't even run the await function in the if statement
	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError("Incorrect email or password!", 401));
	}
	const token = signToken(user._id);

	const newAuditLog = await UserAuditLog.create({
		User: user._id,
		userTask: "Login",
		timestamp: Date.now(),
	});
	res.status(200).json({
		status: "success",
		token,
		auditLog: newAuditLog,
	});

	//3) If everything ok, send token to client
	// createSendToken(user, 200, res);
});

const protect = catchAsync(async (req, res, next) => {
	let token = "";
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	// console.log(token);

	if (!token) {
		return next(
			new AppError("You are not logged in! Please log in to get access.", 401)
		);
	}

	// 2) Verification token
	const decoded = await promisify(verify)(token, process.env.JWT_SECRET);

	// 3) Check if user still exists
	const currentUser = await User.findById(decoded.id);

	if (!currentUser) {
		return next(
			new AppError("The user belonging to this token no longer exist.", 401)
		);
	}
	// 4) Check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError("User recently changed password! Please log in again.", 401)
		);
	}
	// GRANT ACCESS TO PROTECTED ROUTE
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});

const restrictTo = (...roles) => {
	return (req, res, next) => {
		// roles ['superadmin', 'admin']. role='user'
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError("You do not have permission to perform this action", 403)
			);
		}
		next();
	};
};

const forgotPassword = catchAsync(async (req, res, next) => {
	//1) Get user based on POSTed email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new Error("There is no user with that email address.", 404));
	}
	//2) Generate random reset token
	const resetToken = user.createPasswordResetToken();
	await user.save({
		//this will deactivate all the validators that we specified in our schema
		validateBeforeSave: false,
	});

	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Forgot your password? Submit a PATCH request with your new password and 
	passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
	try {
		await sendEmail({
			email: user.email,
			subject: "Your password reset token is valid for 10mins",
			message,
		});

		res.status(200).json({
			status: "success",
			message: "Token sent to email!",
		});
	} catch (err) {
		(user.passwordResetToken = undefined),
			(user.passwordResetExpires = undefined);
		await user.save({ validateBeforeSave: false });
		return next(
			new AppError("There was an error sending the email. Try again later!"),
			500
		);
	}
});

const resetPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on the token
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	// 2) If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError("Token is invalid or has expired", 400));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	//delete the passwordReseToken and passwordResetExpires
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	const token = signToken(user._id);

	const newAuditLog = await UserAuditLog.create({
		User: user._id,
		userTask: "resetPassword",
		timestamp: Date.now(),
	});
	res.status(200).json({
		status: "success",
		token,
		auditLog: newAuditLog,
	});
});

const logout = (req, res) => {
	res.cookie("jwt", "loggedout", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: "success" });
};

export {
	signup,
	login,
	protect,
	restrictTo,
	forgotPassword,
	resetPassword,
	logout,
};
