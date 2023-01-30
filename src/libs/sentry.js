import * as Sentry from "@sentry/node";
import { logger } from "./logger.js";

const { SENTRY_URL, NODE_ENV, BRANCH_NAME } = process.env;

// Initialize Sentry
const init = (app) => {
	if (NODE_ENV !== "development" && SENTRY_URL) {
		Sentry.init({
			dsn: SENTRY_URL,
			environment: NODE_ENV,
			release: BRANCH_NAME,
		});
		app.use(Sentry.Handlers.requestHandler());
	}
};

// Capture errors
const captureError = (msg, err, level = "error") => {
	// Log (warn/error) in local file
	if (level === "warning") logger.warn(msg, err);
	else logger.error(msg, err);

	Sentry.withScope(function (scope) {
		scope.setLevel(level);
		Sentry.captureException(err);
	});
};

// Capture standard messages
const captureMsg = (log) => {
	Sentry.captureMessage(log);
};

// Set extra tags to request
const setExtra = (key, val) => {
	Sentry.configureScope(function (scope) {
		scope.setExtra(key, val);
	});
};

// Add Sentry breadcrumbs
const addBreadcrumb = (msg, log, level = "info") => {
	try {
		if (level === "warning") logger.warn(msg, log);
		else logger.info(msg, log);

		let message = log;
		try {
			message = JSON.stringify(log);
		} catch (err) {
			// Ignore
		}

		Sentry.addBreadcrumb({ category: msg, message, level });
	} catch (err) {
		logger.error(err);
	}
};

export { init, captureError, captureMsg, addBreadcrumb, setExtra };
