import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const TokenClassSchema = new mongoose.Schema({
  image: {
    type: String,
    required: false,
  },
  baseFiatCurrencyCode: {
    type: String,
    required: false,
  },
  baseFiatFXRate: {
    type: Number,
    required: false,
  },
  status:{
    type: String,
    required: false,
  },
  Company: {
    type: ObjectId,
    required: true
  }
});

const tokenClass = mongoose.model("tokenClass", TokenClassSchema);

export default tokenClass;