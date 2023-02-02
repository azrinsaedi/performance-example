// const TokenClass = require("./../models/tokenClassModel");
// const HederaDetail = require("./../models/hederaDetailModel");
// const Wallet = require("./../models/walletModel");
// const PaymentTransaction = require("./../models/paymentTransactionModel");

// const Factory = require("./handlerFactory");
// const catchAsync = require("./../utils/catchAsync");

import TokenClass from "./../models/tokenClassModel.js";
import HederaDetail from "./../models/hederaDetailModel.js";

import Wallet from "./../models/walletModel.js";

import PaymentTransaction from "./../models/paymentTransactionModel.js";

import { createOne } from "./handlerFactory.js";

import catchAsync from "./../utils/catchAsync.js";

// const AppError = require("./../utils/appError");
const createTokenClass = createOne(TokenClass);

const createHederaDetail = createOne(HederaDetail);

const createWallet = createOne(Wallet);

const createPaymentTransaction = createOne(PaymentTransaction);

const getAllTokens = catchAsync(async (req, res, next) => {
	const tokens = await TokenClass.find()
		.populate({
			path: "Company",
		})
		.populate({
			path: "Wallet",
		})
		.populate({
			path: "HederaDetail",
		});

	// SEND RESPONSE
	res.status(200).json({
		status: "success",
		results: tokens.length,
		data: {
			tokens,
		},
	});
});

const getAllHederaDetails = catchAsync(async (req, res, next) => {
	const hederaDetails = await HederaDetail.find().populate({
		path: "TokenClass",
	});

	// SEND RESPONSE
	res.status(200).json({
		status: "success",
		results: hederaDetails.length,
		data: {
			hederaDetails,
		},
	});
});

const getAllWallets = catchAsync(async (req, res, next) => {
	const wallets = await Wallet.find()
		.populate({
			path: "TokenClass",
		})
		.populate({
			path: "Company",
		});

	// SEND RESPONSE
	res.status(200).json({
		status: "success",
		results: wallets.length,
		data: {
			wallets,
		},
	});
});

const getAllPaymentTransactions = catchAsync(async (req, res, next) => {
	const paymentTransactions = await PaymentTransaction.find().populate({
		path: "Wallet",
	});

	// SEND RESPONSE
	res.status(200).json({
		status: "success",
		results: paymentTransactions.length,
		data: {
			paymentTransactions,
		},
	});
});

export {
	createTokenClass,
	createHederaDetail,
	createWallet,
	createPaymentTransaction,
	getAllTokens,
	getAllHederaDetails,
	getAllWallets,
	getAllPaymentTransactions,
};
