import morganBody from "morgan-body";
import winston from "winston";
import util from "util";
import "winston-daily-rotate-file";
import httpContext from "express-http-context";

// Winston - General logging stream
const { format } = winston;
const defaultFormat = format.combine(
	format.errors({ stack: true }),
	format.timestamp(),

	// Log formatting
	format.printf(({ level, message, timestamp }) => {
		const reqId = httpContext.get("reqId"); // Get uniquely generated request ID
		return `${timestamp} ${level}: ${reqId ? `[${reqId}]` : ""} ${message}`;
	})
);

// Options for log file generation
const transportDefOpts = {
	dirname: "./logs",
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxSize: "100m",
	maxFiles: "60d",
};

const winstonLogger = winston.createLogger({
	format: defaultFormat,
	transports: [
		new winston.transports.DailyRotateFile({
			...transportDefOpts,
			filename: "%DATE%-error.log",
			level: "error",
		}),
		new winston.transports.DailyRotateFile({
			...transportDefOpts,
			filename: "%DATE%-combined.log",
		}),
	],
	exitOnError: false,
});

// Only log in console if not in production
if (process.env.NODE_ENV !== "production") {
	winstonLogger.add(new winston.transports.Console());
}

// Helper function to write logs to different levels
const writeLogType = (logLevel) => {
	return function () {
		const args = Array.from(arguments);
		winstonLogger[logLevel](util.format(...args));
	};
};

// Different log levels
const logger = {
	silly: writeLogType("silly"),
	debug: writeLogType("debug"),
	verbose: writeLogType("verbose"),
	info: writeLogType("info"),
	warn: writeLogType("warn"),
	error: writeLogType("error"),
};

// Skip logging of specific routes
const skipRoutes = ["/api"];
const skip = function (req) {
	const url = req.baseUrl + req.path;
	return skipRoutes.some((routes) => url.includes(routes));
};

// Morgan Body - Log request body & response
const requestLogger = (app) => {
	morganBody(app, {
		noColors: true,
		logReqHeaderList: true,
		skip,
		stream: { write: (msg) => winstonLogger.info(msg) },
		filterParameters: ["accessToken", "accesstoken"],
		immediateReqLog: true,
	});
};

export { logger, requestLogger };
