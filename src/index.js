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
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const dbname = process.env.MONGODB_DBNAME;

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`);

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
	console.log("Connected successfully");
  });


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

// Error Middleware
app.use(errorHandler);

// Start Server
app.listen(process.env.PORT, () =>
	logger.info(`Server listening on ${process.env.PORT}`)
);
