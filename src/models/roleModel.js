import mongoose from "mongoose";
const Schema = mongoose.Schema;
const roleSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	User: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
