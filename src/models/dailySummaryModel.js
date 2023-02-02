import mongoose from "mongoose";
const Schema = mongoose.Schema;
const dailySummarySchema = new Schema({
	date: {
		type: Date,
	},
	transactionVolume: {
		type: String,
	},
	tokensMinted: {
		type: String,
	},
	tokensBurned: {
		type: String,
	},
	circulatingTokens: {
		type: String,
	},
	TokenClass: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "TokenClass",
	},
});

const DailySummary = mongoose.model("DailySummary", dailySummarySchema);

export default DailySummary;
