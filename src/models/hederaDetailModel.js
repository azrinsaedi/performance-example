import mongoose from "mongoose";

const Schema = mongoose.Schema;
const hederaDetailSchema = new Schema({
	//tokens [azrin]
	TokenClass: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "TokenClass",
	},
	treasuryAccountId: {
		type: String,
		required: true,
	},
	adminKey: {
		type: String,
		required: true,
	},
	kycKey: {
		type: String,
	},
	freezeKey: {
		type: String,
	},
	wipeKey: {
		type: String,
	},
	supplyKey: {
		type: String,
		required: true,
	},
	freeScheduleKey: {
		type: String,
	},
	pauseKey: {
		type: String,
	},
	decimals: {
		type: Schema.Types.Decimal128,
	},
	initialSupply: {
		type: Number,
	},
	supplyType: {
		type: String,
	},
	maxSupply: {
		type: Number,
	},
	hederaTokenId: {
		type: String,
		required: true,
	},
});

const HederaDetail = mongoose.model("HederaDetail", hederaDetailSchema);

export default HederaDetail;
