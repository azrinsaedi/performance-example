import mongoose from "mongoose";
import countryCodes from "currency-codes";

const countryArray = countryCodes.countries();

const Schema = mongoose.Schema;
const companySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	businessScope: {
		type: String,
	},
	legalName: {
		type: String,
		required: true,
	},
	registrationNumber: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		enum: countryArray,
		required: [true, "Please enter a country"],
		// ref: "LiquidityPartner",
	},

	city: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	postCode: {
		type: String,
		required: true,
	},
	mcc: {
		type: String,
		required: true,
	},
	Contact: {
		person: {
			type: String,
		},
		phone: {
			type: Number,
		},
		email: {
			type: String,
		},
	},
	ReceivingBank: {
		bankName: {
			type: String,
		},
		bankAccNo: {
			type: Number,
		},
		bankSwiftCode: {
			type: String,
		},
		accName: {
			type: String,
		},
	},
	LiquidityPartner: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "LiquidityPartner",
	},
});

// companySchema.pre(/^find/, function (next) {
// 	this.populate({
// 		path: "LiquidityPartner",
// 	});
// 	next();
// });

const Company = mongoose.model("Company", companySchema);

export default Company;
