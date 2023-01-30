import express from "express";
import { addBreadcrumb } from "../libs/sentry.js";
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



const router = express.Router();



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
	"/type",

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

router.post(
	"/create-account",

	// Request validator
	// username,
	// password,
	// validatorReplaceBody,

	// Handle request
	async (req, res) => {
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
				// .setInitialBalance(Hbar.fromTinybars(1000))
				.execute(client);

			// Get the new account ID
			const getReceipt = await newAccount.getReceipt(client);
			const newAccountId = getReceipt.accountId;

			console.log("The new account ID is: " +newAccountId);
			console.log("The new account PV Key is: " +newAccountPrivateKey);
			console.log("The new account PU Key is: " +newAccountPublicKey);

			//Verify the account balance
			const accountBalance = await new AccountBalanceQuery()
				.setAccountId(newAccountId)
				.execute(client);

			console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");
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
