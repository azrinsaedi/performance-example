import express from "express";
import { addBreadcrumb } from "../libs/sentry.js";
import { username, password } from "../validators/example.js";
import { validatorReplaceBody } from "../validators/validatorHelper.js";
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
	"/",

	// Request validator
	username,
	password,
	validatorReplaceBody,

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
