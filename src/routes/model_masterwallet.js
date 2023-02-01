import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  company_id: {
    type: String,
    required: true,
  },
  wallet_id: {
    type: String,
    required: true,
  },
  private_key: {
    type: String,
    required: true,
  },
  public_key: {
    type: String,
    required: false,
  }
});

const masterWallet = mongoose.model("masterWallet", UserSchema);

// module.exports = {tokenClass};

export default masterWallet;