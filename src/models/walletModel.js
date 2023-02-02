import mongoose from "mongoose";
const Schema = mongoose.Schema;
const walletSchema = new Schema({
	balance: {
		type: Number,
		required: true,
	},
	TokenClass: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "TokenClass",
	},
	hederaId: {
		type: String,
		required: true,
	},
	Company: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Company",
	},
	type: {
		type: String,
		required: true,
		enum: ["master", "accountHolder", "merchant"],
	},
	externalAppRefId: {
		type: String,
	},
	merchantName: {
		type: String,
	},
	currencyCode: {
		type: String,
	},
});

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
