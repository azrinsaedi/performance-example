// const mongoose = require("mongoose");
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const tokenClassSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	totalAmount: {
		type: Number,
		required: true,
	},
	currentAmount: {
		type: Number,
	},
	Company: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Company",
	},
	baseFiatCurrencyCode: {
		type: String,
		required: true,
	},
	baseFiatFxRate: {
		type: String,
	},
	type: {
		type: String,
		required: true,
	},
	Wallet: {
		type: Schema.Types.ObjectId,
		// required: true,
		ref: "Wallet",
	},
	HederaDetail: {
		type: Schema.Types.ObjectId,
		// required: true,
		ref: "HederaDetail",
	},
	status: {
		type: String,
		// required: true,
		enum: ["active", "inactive"],
		default: "active",
	},
});

const TokenClass = mongoose.model("TokenClass", tokenClassSchema);

export default TokenClass;
