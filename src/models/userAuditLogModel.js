import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userAuditLogSchema = new Schema(
	{
		User: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		userTask: {
			type: String,
			required: true,
		},
		timestamp: {
			type: Date,
			required: true,
		},
	},
	{
		timestamp: true,
	}
);

const UserAuditLog = mongoose.model("UserAuditLog", userAuditLogSchema);

export default UserAuditLog;
