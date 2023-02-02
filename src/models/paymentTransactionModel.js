import mongoose from "mongoose";
import countryCode from "currency-codes";

const Schema = mongoose.Schema;
const currencyCodes = countryCode.codes();

const paymentTransactionSchema = new Schema({
	status: {
		type: String,
		enum: ["ready", "paid", "expired"],
	},
	amountInCents: {
		type: Number,
		required: true,
	},
	currencyCode: {
		type: String,
		enum: currencyCodes,
		required: true,
	},
	tokenAmount: {
		type: Number,
		required: true,
	},
	transactionDate: {
		type: Date,
		default: Date.now(),
	},
	Wallet: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Wallet",
	},
});

const PaymentTransaction = mongoose.model(
	"PaymentTransaction",
	paymentTransactionSchema
);

export default PaymentTransaction;
