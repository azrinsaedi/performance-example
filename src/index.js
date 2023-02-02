import "dotenv/config.js";
import express from "express";
import httpContext from "express-http-context";

import { logger, requestLogger } from "./libs/logger.js";
import { init as sentryInit } from "./libs/sentry.js";
import { initHelmet } from "./libs/helmet.js";
import { rateLimiterMiddleware } from "./libs/rateLimiter.js";
import serveStatics from "./libs/serveStatics.js";
import { genUid, genTag } from "./middlewares/requestIds.js";
import { errorHandler } from "./middlewares/error.js";
import exampleRoute from "./routes/example.js";
import token from "./routes/token.js";
import you2api from "./routes/you2api.js";

import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRoutes.js";
import companyRouter from "./routes/companyRoutes.js";
import liquidityPartnerRouter from "./routes/liquidityPartnerRoutes.js";
import testRouter from "./routes/testRoutes.js";

const app = express();

const { NODE_ENV } = process.env;
logger.info({ NODE_ENV });

// Initialize Sentry
sentryInit(app);

// Express Configs
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Security
app.use(rateLimiterMiddleware);
initHelmet(app);

// Serve statics
serveStatics(app);

// Generate UID per request
app.use(httpContext.middleware);
app.use(genTag);
app.use(genUid);

// Logger
requestLogger(app);

// Routes
app.use("/example", exampleRoute);
app.use("/token", token);
app.use("/you2api", you2api);
app.use("/users", userRouter);
app.use("/companies", companyRouter);
app.use("/liquidityPartners", liquidityPartnerRouter);
app.use("/test", testRouter);
app.all("*", (req, res, next) => {
	next(new Error(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Middleware
app.use(errorHandler);

// Start Server
const DB = process.env.DB_URL;

mongoose.set('strictQuery', false);
mongoose.connect(DB, {}).then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION! ?? Shutting down...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

process.on("SIGTERM", () => {
	console.log("?? SIGTERM RECEIVED. Shutting down gracefully");
	server.close(() => {
		console.log("?? Process terminated!");
	});
});

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	console.log("Hello from the middleware ??");
	next();
});

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// console.log(`Countries: ${countryCodes.countries()}`);
// console.log(`Country Codes: ${countryCodes.codes()}`);

export { app };
