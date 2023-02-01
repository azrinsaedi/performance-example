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
	TokenAssociateTransaction,
	AccountInfoQuery,
	TokenUpdateTransaction,
	Hbar } from "@hashgraph/sdk";
// import { username, password } from "../validators/example.js";
// import { validatorReplaceBody } from "../validators/validatorHelper.js";

import masterWallet from "./model_masterwallet.js";
import token from "./model_token.js";
import tokenClass from "./model_modify_tokenClass.js";

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
	"/create-token-type",

	// Request validator
	// username,
	// password,
	// validatorReplaceBody,

	// Handle request
	async (req, res) => {
		const token_data = new token(req.body);
		try {

			const operatorId =  AccountId.fromString(req.body.operatorId);
			const operatorKey = PrivateKey.fromString(req.body.operatorKey);

			const client = Client.forTestnet().setOperator(operatorId, operatorKey);

			const treasuryAccountId =  AccountId.fromString(req.body.treasuryAccountId);
			const treasuryKey = PrivateKey.fromString(req.body.treasuryKey);

			const tokenName = req.body.tokenName;
			const tokenSymbol = req.body.tokenSymbol;
			const tokenDecimals = req.body.tokenDecimals;
			var initialSupply = req.body.initialSupply;
			const peggedCurrency =req.body.peggedCurrency;
			const peggedValue = req.body.peggedValue;
			const maxTransactionFee = req.body.maxTransactionFee;

			const supplyKey = PrivateKey.generate();
			const adminKey = PrivateKey.generate();
			const kycKey = PrivateKey.generate();
			const freezeKey = PrivateKey.generate();
			const wipeKey = PrivateKey.generate();
			const pauseKey = PrivateKey.generate();
			const feeScheduleKey =  PrivateKey.generate();

			token_data.master_wallet_id = treasuryAccountId; 
			token_data.token_name = tokenName;
			token_data.token_symbol = tokenSymbol;
			token_data.token_decimals = tokenDecimals;
			token_data.initial_supply = initialSupply;
			token_data.supply_key = supplyKey;
			token_data.admin_key = adminKey;
			token_data.kyc_key = kycKey;
			token_data.freeze_key = freezeKey;
			token_data.wipe_key = wipeKey
			token_data.pause_key = pauseKey
			token_data.fee_schedule_key = feeScheduleKey;
			token_data.pegged_currency = peggedCurrency;
			token_data.pegged_value = peggedValue;
			token_data.maxTransactionFee = maxTransactionFee;
			

			var tokenType = req.body.tokenType;

			if (tokenType == 'fungible' || tokenType == null) {
				tokenType = TokenType.FungibleCommon;
			}
			else if(tokenType == 'nonfungible'){
				tokenType = TokenType.NonFungibleUnique;
				initialSupply = 0;
			}
			token_data.token_type = tokenType;

			var supplyType = req.body.supplyType

			if (supplyType == 'infinite' || supplyType == null){
				supplyType = TokenSupplyType.Infinite
			}
			else if(supplyType == 'finite'){
				supplyType = TokenSupplyType.Finite;
			}
			token_data.supply_type = supplyType;

			var maxSupply = req.body.maxSupply;
			token_data.max_supply = maxSupply;

			let tokenCreateTx;
			//CREATE NFT
				if (req.body.supplyType == "finite"){
					tokenCreateTx = await new TokenCreateTransaction()
					.setTokenName(tokenName)
					.setTokenSymbol(tokenSymbol)
					.setTokenType(tokenType)
					.setDecimals(tokenDecimals)
					.setInitialSupply(initialSupply)
					.setAdminKey(adminKey)
					.setKycKey(kycKey)
					.setFreezeKey(freezeKey)
					.setWipeKey(wipeKey)
					.setPauseKey(pauseKey)
					.setFeeScheduleKey(feeScheduleKey)
					.setTreasuryAccountId(treasuryAccountId)
					.setSupplyType(supplyType)
					.setSupplyKey(supplyKey)
					.setMaxSupply(maxSupply)
					.setMaxTransactionFee(new Hbar(maxTransactionFee))
					.freezeWith(client);

				}

				else {
					// CREATE FUNGIBLE TOKEN (STABLECOIN)
					tokenCreateTx = await new TokenCreateTransaction()
					.setTokenName(tokenName)
					.setTokenSymbol(tokenSymbol)
					.setTokenType(tokenType)
					.setDecimals(tokenDecimals)
					.setInitialSupply(initialSupply)
					.setAdminKey(adminKey)
					.setKycKey(kycKey)
					.setFreezeKey(freezeKey)
					.setWipeKey(wipeKey)
					.setPauseKey(pauseKey)
					.setFeeScheduleKey(feeScheduleKey)
					.setTreasuryAccountId(treasuryAccountId)
					.setSupplyType(supplyType)
					.setSupplyKey(supplyKey)
					.setMaxTransactionFee(new Hbar(maxTransactionFee))
					.freezeWith(client);
				}

			// //SIGN WITH TREASURY KEY
			let tokenCreateSign = await (await (await tokenCreateTx.sign(treasuryKey)).sign(adminKey));

			// //SUBMIT THE TRANSACTION
			let tokenCreateSubmit = await tokenCreateSign.execute(client);

			// //GET THE TRANSACTION RECEIPT
			let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

			// //GET THE TOKEN ID
			let tokenId = tokenCreateRx.tokenId;
			token_data.token_id = tokenId;

			await token_data.save();
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
	"/master-account-details",

	// Request validator
	// username,
	// password,
	// validatorReplaceBody,

	// Handle request
	async (req, res) => {
		// const token_data = new token(req.body);
		try {
			const operatorId =  AccountId.fromString(req.body.operatorId);
			const operatorKey = PrivateKey.fromString(req.body.operatorKey);
			const client = Client.forTestnet().setOperator(operatorId, operatorKey);

			const newAccountId = AccountId.fromString(req.body.master_wallet_id);
			
			//Create the account info query
			const query = new AccountInfoQuery()
			.setAccountId(newAccountId);

			//Sign with client operator private key and submit the query to a Hedera network
			var accountInfo = await query.execute(client);

			// accountInfo = JSON.stringify(accountInfo);


			// await token_data.save();
			res.send(accountInfo);
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
	"/master-account-balance",

	// Request validator
	// username,
	// password,
	// validatorReplaceBody,

	// Handle request
	async (req, res) => {
		// const token_data = new token(req.body);
		try {
			const operatorId =  AccountId.fromString(req.body.operatorId);
			const operatorKey = PrivateKey.fromString(req.body.operatorKey);
			const client = Client.forTestnet().setOperator(operatorId, operatorKey);

			const newAccountId = AccountId.fromString(req.body.master_wallet_id);
			
			const query = new AccountBalanceQuery()
			.setAccountId(newAccountId);
		
			//Sign with the client operator private key and submit to a Hedera network
			const tokenBalance = await query.execute(client);
			
			console.log("The token balance(s) for this account: " +tokenBalance.tokens.toString());


			// await token_data.save();
			res.send(tokenBalance);
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
	"/modify-token-type",

	// Request validator
	// username,
	// password,
	// validatorReplaceBody,

	// Handle request
	async (req, res) => {

		try {
			
			const token_class_data = new tokenClass(req.body);
			const fetchedData =  await tokenClass.find({ Company: req.body.Company, status: "active"});

			//Take data from fetchedData other than modified data and resend through token_class_data

			token_class_data.Company =  req.body.Company;
			token_class_data.image = req.body.image;
			token_class_data.baseFiatCurrencyCode =  req.body.baseFiatCurrencyCode;
			token_class_data.baseFiatFxRate =  req.body.baseFiatFXRate;
			token_class_data.status =  "active";
			await token_class_data.save();

			for( const item of fetchedData) {
				await tokenClass.updateOne({_id: item._id, status: "active"}, {status: "inactive"})
			}
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
