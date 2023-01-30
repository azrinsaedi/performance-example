import { body } from "express-validator";

export const username = body("username")
	.escape()
	.not()
	.isEmpty()
	.bail()
	.isString()
	.withMessage("Is not string")
	.bail()
	.isLength({ min: 5, max: 30 })
	.withMessage("Is invalid length");

export const password = body("password")
	.escape()
	.not()
	.isEmpty()
	.bail()
	.isString()
	.withMessage("Is not string")
	.bail()
	.isLength({ min: 5, max: 30 })
	.withMessage("Is invalid length");
