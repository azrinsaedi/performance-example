import mongoose from "mongoose";
const Schema = mongoose.Schema;
const fiatCurrencyListSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	currencyCode: {
		type: String,
		required: true,
	},
});

const FiatCurrencyList = mongoose.model(
	"FiatCurrencyList",
	fiatCurrencyListSchema
);

export default FiatCurrencyList;
