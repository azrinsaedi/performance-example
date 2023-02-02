// const express = require("express");
// const testController = require("../controllers/testController");

import express from "express";
import {
	createTokenClass,
	createHederaDetail,
	createWallet,
	createPaymentTransaction,
	getAllTokens,
	getAllHederaDetails,
	getAllWallets,
	getAllPaymentTransactions,
} from "../controllers/testController.js";
// const authController = require("../controllers/authController");

const router = express.Router();

router.route("/token").get(getAllTokens).post(createTokenClass);

router.route("/hedera").get(getAllHederaDetails).post(createHederaDetail);

router.route("/wallet").get(getAllWallets).post(createWallet);

router
	.route("/paymentTransaction")
	.get(getAllPaymentTransactions)
	.post(createPaymentTransaction);

export default router;
