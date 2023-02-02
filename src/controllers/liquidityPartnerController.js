import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";
import { createOne } from "./handlerFactory.js";
import LiquidityPartner from "./../models/liquidityPartnerModel.js";

const getAllLiquidityPartners = catchAsync(async (req, res, next) => {
	const lps = await LiquidityPartner.find();

	// SEND RESPONSE
	res.status(200).json({
		status: "success",
		results: lps.length,
		data: {
			lps,
		},
	});
});

const createLP = createOne(LiquidityPartner);

export { getAllLiquidityPartners, createLP };
