import express from "express";
import {
	getAllCompanies,
	createCompany,
	updateThisCompany,
} from "../controllers/companyController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.route("/").get(protect, getAllCompanies).post(createCompany);

// router
// 	.route("/:id")
// 	.get(companyController.getUser)
// 	.patch(companyController.updateUser)
// 	.delete(companyController.deleteUser);

export default router;
