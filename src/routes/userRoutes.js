import express from "express";

import {
	getAllUsers,
	getUser,
	updateUser,
	deleteUser,
	createUser,
} from "./../controllers/userController.js";
import {
	signup,
	login,
	protect,
	restrictTo,
	forgotPassword,
	resetPassword,
} from "./../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// router.use(protect);

router.route("/").get(protect, getAllUsers).post(createUser);

router
	.route("/:id")
	.get(protect, getUser)
	.patch(updateUser)
	.delete(protect, restrictTo("superadmin", "admin"), deleteUser);

// module.exports = router;

export default router;
