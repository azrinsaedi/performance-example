import mongoose from "mongoose";
import countryCodes from "currency-codes";
const countryArray = countryCodes.countries();
const currencyCodesArray = countryCodes.codes();

const Schema = mongoose.Schema;
const liquidityPartnerSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		fiatCurrencyList: {
			type: [String],
			enum: currencyCodesArray,
		},
		tokenCurrencyList: {
			type: [String],
		},
		baseCountry: {
			type: String,
			enum: countryArray,
			required: [true, "Please provide a country"],
		},
	},
	{
		timestamps: true,
	}
);

const LiquidityPartner = mongoose.model(
	"LiquidityPartner",
	liquidityPartnerSchema
);

export default LiquidityPartner;
