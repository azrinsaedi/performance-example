import { nanoid } from "nanoid";
import httpContext from "express-http-context";
import { setExtra, captureError } from "../libs/sentry.js";

// Generate tag per request
const genTag = async (req, res, next) => {
	try {
		req.tag = req.baseUrl + req.path;
		next();
	} catch (err) {
		captureError(req.baseUrl + req.path, "Failed to generate tag");
		res.sendStatus(500);
	}
};

// Generate UID per request
const genUid = async (req, res, next) => {
	try {
		req.id = Date.now() + nanoid(5);
		httpContext.set("reqId", req.id);
		setExtra("id", req.id);
		next();
	} catch (err) {
		captureError(req.baseUrl + req.path, "Failed to generate UID");
		res.sendStatus(500);
	}
};

export { genTag, genUid };
