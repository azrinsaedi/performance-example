import mongoose from "mongoose";
const Schema = mongoose.Schema;
const accountHolderWalletSchema = new Schema({
	Wallet: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Wallet",
	},
	externalAppRefID: {
		type: String,
	},
});

const AccountHolderWallet = mongoose.model(
	"AccountHolderWallet",
	accountHolderWalletSchema
);

export default AccountHolderWallet;
