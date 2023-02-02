import Company from "./../models/companyModel.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";
import { createOne } from "./handlerFactory.js";
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

const getAllCompanies = catchAsync(async (req, res, next) => {
	const companies = await Company.find().populate({
		path: "LiquidityPartner",
	});

	// SEND RESPONSE
	res.status(200).json({
		status: "success",
		results: companies.length,
		data: {
			companies,
		},
	});
});

const createCompany = createOne(Company);

// //Get countryCode list
// const countryCodeList = await LiquidityPartner.find(
// 	{},
// 	{ projection: { _id: 0, baseCountry: 1 } }
// );

const updateThisCompany = catchAsync(async (req, res, next) => {
	// 1) Create error if user POSTs password data
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				"This route is not for password updates. Please use /updateMyPassword.",
				400
			)
		);
	}

	// 2) Filtered out unwanted fields names that are not allowed to be updated
	const filteredBody = filterObj(req.body, "name", "email");

	// 3) Update company document
	const updatedCompany = await Company.findByIdAndUpdate(
		req.user.id,
		filteredBody,
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json({
		status: "success",
		data: {
			company: updatedCompany,
		},
	});
});

export { getAllCompanies, createCompany, updateThisCompany };
