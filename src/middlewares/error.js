import { addBreadcrumb, captureError } from "../libs/sentry.js";

export const errorHandler = (err, req, res, next) => {
	try {
		addBreadcrumb("errorHandler", err, "warning");
		if (res.headersSent) return next(err);

		res.status(400).send({
			success: false,
			msg: err.message,
		});
	} catch (err) {
		captureError("errorHandler", err);
		next(err);
	}
};
