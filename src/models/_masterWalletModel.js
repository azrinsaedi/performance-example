import mongoose from "mongoose";
const Schema = mongoose.Schema;
const masterWalletSchema = new Schema({
	Wallet: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Wallet",
	},
});

const MasterWallet = mongoose.model("MasterWallet", masterWalletSchema);

export default MasterWallet;
