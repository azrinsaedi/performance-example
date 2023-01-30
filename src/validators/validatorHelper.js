import { validationResult, matchedData } from "express-validator";
import { addBreadcrumb } from "../libs/sentry.js";

const checkValid = async (req, res) => {
	const tag = "checkValid";
	let errResults = validationResult(req);
	if (errResults.isEmpty()) return true;

	const invalidPayload = [];
	errResults.array().forEach((err) => {
		addBreadcrumb(tag, err, "warning");
		const { value, msg, param, nestedErrors } = err;

		if (param === "accesstoken") {
			res.status(401).send(msg);
			return false;
		}

		invalidPayload.push({
			...(param !== "_error" && { param }),
			value,
			msg,
			nestedErrors,
		});
	});

	const payload = {
		success: false,
		msg: "Invalid payload",
		desc: invalidPayload,
	};
	res.status(400).send(payload);
	return false;
};

export const validator = async (req, res, next) => {
	try {
		const isValid = await checkValid(req, res, next);
		if (!isValid) return;
	} catch (err) {
		return next(err);
	}

	next();
};

export const validatorReplaceBody = async (req, res, next) => {
	try {
		const isValid = await checkValid(req, res, next);
		if (!isValid) return;
	} catch (err) {
		return next(err);
	}

	req.body = matchedData(req, { locations: ["body"] });
	next();
};
