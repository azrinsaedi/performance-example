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
    TokenMintTransaction} from "@hashgraph/sdk";


// import { username, password } from "../validators/example.js";
// import { validatorReplaceBody } from "../validators/validatorHelper.js";


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
	"/token-mint",

	// Request validator
	// username,
	// password,
	// validatorReplaceBody,

	// Handle request
	async (req, res) => {
		try {
            //Mint another 1,000 tokens and freeze the unsigned transaction for manual signing
            const operatorId =  AccountId.fromString(req.body.operatorId);
			const operatorKey = PrivateKey.fromString(req.body.operatorKey);
            const supplyKey = PrivateKey.fromString(req.body.supplyKey);
            const tokenAmount = req.body.tokenAmount;

			const client = Client.forTestnet().setOperator(operatorId, operatorKey);

            const tokenId = req.body.tokenId;
            const transaction = await new TokenMintTransaction()
            .setTokenId(tokenId)
            .setAmount(tokenAmount)
            .freezeWith(client);

            //Sign with the supply private key of the token 
            const signTx = await transaction.sign(supplyKey);

            //Submit the transaction to a Hedera network    
            const txResponse = await signTx.execute(client);

            //Request the receipt of the transaction
            const receipt = await txResponse.getReceipt(client);

            //Get the transaction consensus status
            const transactionStatus = receipt.status;

            console.log("The transaction consensus status " +transactionStatus.toString());

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
	"/hbar-purchase",

	// Request validator
	// username,
	// password,
	// validatorReplaceBody,

	// Handle request
	async (req, res) => {
		try {
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
