import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;
const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter a name"],
		},
		email: {
			type: String,
			required: [true, "Please enter an email"],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, "Please provide a valid email"],
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, "Please confirm your password!"],
			validate: {
				//This only works on CREATE and SAVE!!!
				validator: function (el) {
					return el === this.password;
				},
				message: "Passwords are not the same!",
			},
		},
		UserAuditLog: {
			type: Schema.Types.ObjectId,
			// required: true,
			ref: "UserAuditLog",
		},
		role: {
			type: String,
			enum: ["superadmin", "admin", "user"],
			default: "user",
		},
		countryCode: {
			type: String,
		},
		Company: {
			type: Schema.Types.ObjectId,
			// required: true,
			// ref: "Company",
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", async function (next) {
	//Only run if passsword is modified
	if (!this.isModified("password")) return next();
	//Hash password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);
	//Delete passwordConfirm field
	this.passwordConfirm = undefined;

	next();
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password") || this.isNew) return next();
	//minus 1 sec to ensure token is created after password changed
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	// console.log(this.passwordChangedAt, JWTTimestamp);
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 100,
			10
		);
		// console.log(changedTimestamp, JWTTimestamp);
		return JWTTimestamp < changedTimestamp;
	}
	//false means not changed
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	console.log({ resetToken }, this.passwordResetToken);

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};
export default mongoose.model("User", userSchema);
