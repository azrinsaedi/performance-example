import express from "express";
import {
	getAllLiquidityPartners,
	createLP,
} from "../controllers/liquidityPartnerController.js";

const router = express.Router();

// router.post("/createCompany", authController.signup);
// router.post("/login", authController.login);

// router.post("/forgotPassword", authController.forgotPassword);

router.route("/").get(getAllLiquidityPartners).post(createLP);

// router
// 	.route("/:id")
// 	.get(companyController.getUser)
// 	.patch(companyController.updateUser)
// 	.delete(companyController.deleteUser);

export default router;
