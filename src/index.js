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

// Error Middleware
app.use(errorHandler);

// Start Server
app.listen(process.env.PORT, () =>
	logger.info(`Server listening on ${process.env.PORT}`)
);
