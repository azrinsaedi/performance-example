import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  token_name: {
    type: String,
    required: true,
  },
  token_symbol: {
    type: String,
    required: true,
  },
  token_decimals: {
    type: Number,
    required: true,
  },
  initial_supply: {
    type: Number,
    required: true,
  },
  supply_key: {
    type: String,
    required: true,
  },
  admin_key: {
    type: String,
    required: true,
  },  
  kyc_key: {
    type: String,
    required: true,
  },
  freeze_key: {
    type: String,
    required: true,
  },
  wipe_key: {
    type: String,
    required: true,
  },
  pause_key: {
    type: String,
    required: true,
  },
  fee_schedule_key: {
    type: String,
    required: true,
  },
  token_id: {
    type: String,
    required: true,
  },
  token_type:{
    type: String,
    required: true
  },
  supply_type:{
    type: String,
    required: true
  },
  max_supply:{
    type: String,
    required: false
  },
  master_wallet_id:{
    type: String,
    required: false
  },
  pegged_currency:{
    type: String,
    required: true
  },
  pegged_value:{
    type: Number,
    required: true
  }
});

const token = mongoose.model("token", TokenSchema);

// module.exports = {token};

export default token;