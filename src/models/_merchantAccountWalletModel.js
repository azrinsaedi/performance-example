import mongoose from "mongoose";
const Schema = mongoose.Schema;
const merchantAccountWalletSchema = new Schema({
	Wallet: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Wallet",
	},
	merchantName: {
		type: String,
	},
	currencyCode: {
		type: String,
	},
});

const MerchantAccountWallet = mongoose.model(
	"MerchantAccountWallet",
	merchantAccountWalletSchema
);

export default MerchantAccountWallet;
