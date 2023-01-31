import mongoose from "mongoose";

const username = "you2uc";
const password = "sUm64shmQwBCPkuQ";
const cluster = "you2uc.d8on8ld";
const dbname = "you2uc";

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`);

  const db = mongoose.connection;
	db.collection("masterWallet");
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
	console.log("Connected successfully");
  });

export default mongoose_connect = mongoose;