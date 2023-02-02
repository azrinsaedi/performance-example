import mongoose from "mongoose";

const Schema = mongoose.Schema;
const tokenTransactionSchema = new Schema(
	{
		ucAmount: {
			type: Number,
		},
		SenderWallet: {
			type: Schema.Types.ObjectId,
			ref: "Wallet",
		},
		ReceiverWallet: {
			type: Schema.Types.ObjectId,
			ref: "Wallet",
		},
		transactionDate: {
			type: Date,
		},
	},
	{
		timestamp: true,
	}
);

const TokenTransaction = mongoose.model(
	"TokenTransaction",
	tokenTransactionSchema
);

export default TokenTransaction;
