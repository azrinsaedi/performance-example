import mongoose from "mongoose";
const Schema = mongoose.Schema;
const settlementSchema = new Schema({
	PaymentTransaction: [
		{
			type: Schema.Types.ObjectId,
			required: true,
			ref: "PaymentTransaction",
		},
	],
	settlementDate: {
		type: String,
	},
});

const Settlement = mongoose.model("Settlement", settlementSchema);

export default Settlement;
