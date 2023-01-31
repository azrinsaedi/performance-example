import express from "express";
import { addBreadcrumb } from "../libs/sentry.js";
import mongoose from "mongoose";
import { AccountId,
	PrivateKey,
	Client,
	TokenCreateTransaction,
	TokenType,
	TokenSupplyType,
	TransferTransaction,
	AccountCreateTransaction,
	AccountBalanceQuery,
	TokenAssociateTransaction, } from "@hashgraph/sdk";
// import { username, password } from "../validators/example.js";
// import { validatorReplaceBody } from "../validators/validatorHelper.js";

import masterWallet from "./models.js";

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

const router = express.Router();

router.use(express.json());


/**
 * @apiDefine InvalidPayload Invalid payload response
 * @apiError (Invalid Payload) {Boolean=false} success Success status
 * @apiError (Invalid Payload) {String} msg General error message
 * @apiError (Invalid Payload) {Object[]} desc Description of error
 * @apiErrorExample {json} Invalid payload
 * {
 *   "success": false,
 *   "msg": "Invalid payload",
 *   "desc": [
 *      {
 *         "param": "username",
 *         "value": "",
 *         "msg": "Invalid value"
 *      }
 *   ]
 * }
 */

/**
 *
 * @api {post} /example Example Request
 * @apiDescription Example description
 * @apiName UniqueName
 * @apiGroup Sample Group
 * @apiVersion 1.0.0
 *
 * @apiBody (Request Body) {String{5..30}} username Username
 * @apiBody (Request Body) {String{5..30}} password Password
 *
 * @apiParamExample  {json} Body
 * {
 *   "username": "username",
 *   "password": "password",
 * }
 *
 * @apiExample {js} Node.js
// Require dependencies
const sampleDep = require("sampleDep");
const sampleFn = async () => {
  // Sample Codes
};
sampleFn();
 * 
 * @apiSuccess (Response) {Boolean=true,false} success Success status
 *
 * @apiSuccessExample {json} Success
 * {
 *   "success": true,
 * }
 *
 * @apiUse InvalidPayload
 * 
 */

router.post(
	"/create-account",

	// Request validator
	// username,
	// password,
	// validatorReplaceBody,

	// Handle request
	async (req, res) => {
		const master = new masterWallet(req.body);

		try {
			//Grab your Hedera testnet account ID and private key from your .env file
			const myAccountId = process.env.ACCOUNT_ID;
			const myPrivateKey = process.env.PRIVATE_KEY;

			// If we weren't able to grab it, we should throw a new error
			if (myAccountId == null ||
				myPrivateKey == null ) {
				throw new Error("Environment variables myAccountId and myPrivateKey must be present");
			}

			// Create our connection to the Hedera network
			// The Hedera JS SDK makes this really easy!
			const client = Client.forTestnet();

			client.setOperator(myAccountId, myPrivateKey);

			//Create new keys
			const newAccountPrivateKey = PrivateKey.generateED25519(); 
			const newAccountPublicKey = newAccountPrivateKey.publicKey;

			//Create a new account with 1,000 tinybar starting balance
			const newAccount = await new AccountCreateTransaction()
				.setKey(newAccountPublicKey)
				.execute(client);

			// Get the new account ID
			const getReceipt = await newAccount.getReceipt(client);
			const newAccountId = getReceipt.accountId;

			master.wallet_id = newAccountId;
			master.private_key = newAccountPrivateKey;
			master.public_key = newAccountPublicKey;
			await master.save();
			res.send({ success: true });
		} catch (err) {
			addBreadcrumb(req.tag, err);
			res.status(500).send({
				success: false,
				msg: err.message,
			});
		}
	}
);


router.post(
	"/token-type",

	// Request validator
	// username,
	// password,
	// validatorReplaceBody,

	// Handle request
	async (req, res) => {
		try {
			// const operatorId =  AccountId.fromString("0.0.2405620");
			// const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420653eb0dac9a22036c71efd27972f6bdb477905d934e1b4c1262d81dc19d29b6e");
			// const client = Client.forTestnet().setOperator(operatorId, operatorKey);
			// const treasuryAccountId =  AccountId.fromString("0.0.2399711");
			// const treasuryKey = PrivateKey.fromString("c30bedfef76ac39e53dfd675efffc2951da0ddfcddddf476f4aec7d5819e223d");

			const operatorId =  AccountId.fromString(req.body.operatorId);
			const operatorKey = PrivateKey.fromString(req.body.operatorKey);

			const client = Client.forTestnet().setOperator(operatorId, operatorKey);

			const treasuryAccountId =  AccountId.fromString(req.body.treasuryAccountId);
			const treasuryKey = PrivateKey.fromString(req.body.treasuryKey);

			const supplyKey = PrivateKey.generate();
			const adminKey = PrivateKey.generate();
			const kycKey = PrivateKey.generate();
			const freezeKey = PrivateKey.generate();
			const wipeKey = PrivateKey.generate();
			const pauseKey = PrivateKey.generate();
			const feeScheduleKey =  PrivateKey.generate();

			var tokenType = req.body.tokenType;

			if (tokenType == 'fungible') {
				tokenType = TokenType.FungibleCommon;
			}
			else if(tokenType == 'nonfungible'){
				tokenType = TokenType.NonFungibleUnique;
			}

			// CREATE FUNGIBLE TOKEN (STABLECOIN)
			let tokenCreateTx = await new TokenCreateTransaction()
				.setTokenName("USD Bar")
				.setTokenSymbol("USDB")
				.setTokenType(tokenType)
				.setDecimals(2)
				.setInitialSupply(10000)
				.setAdminKey(adminKey)
				.setKycKey(kycKey)
				.setFreezeKey(freezeKey)
				.setWipeKey(wipeKey)
				.setPauseKey(pauseKey)
				.setFeeScheduleKey(feeScheduleKey)
				.setTreasuryAccountId(treasuryAccountId)
				.setSupplyType(TokenSupplyType.Infinite)
				.setSupplyKey(supplyKey)
				.freezeWith(client);

			// //SIGN WITH TREASURY KEY
			let tokenCreateSign = await (await (await tokenCreateTx.sign(treasuryKey)).sign(adminKey));

			// //SUBMIT THE TRANSACTION
			let tokenCreateSubmit = await tokenCreateSign.execute(client);

			// //GET THE TRANSACTION RECEIPT
			let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

			// //GET THE TOKEN ID
			let tokenId = tokenCreateRx.tokenId;

			// //LOG THE TOKEN ID TO THE CONSOLE
			console.log(`- Created token with ID: ${tokenId} \n`);
			console.log(`- Supply Key is ${supplyKey} \n`)
			console.log(`- Admin Key is ${adminKey} \n`)

			// const user_name = req.body.user;
			// console.log(user_name);
			res.send({ success: true });
		} catch (err) {
			addBreadcrumb(req.tag, err);
			res.status(500).send({
				success: false,
				msg: err.message,
			});
		}
	}
);




export default router;
