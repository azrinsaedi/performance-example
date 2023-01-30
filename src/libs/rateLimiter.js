import {
	RateLimiterRedis,
	RateLimiterMemory,
	BurstyRateLimiter,
} from "rate-limiter-flexible";
import { initRedis } from "./redis.js";

const redis = initRedis(0);

// Default rate limiter options
const rateLimitDefOpt = {
	points: 300, // 300 requests
	duration: 60, // over 60 seconds
	inmemoryBlockOnConsumed: 300, // https://github.com/animir/node-rate-limiter-flexible/wiki/In-memory-Block-Strategy
};

// Rate limiter w/ memory as insurance
const rateLimiterMemory = new RateLimiterMemory(rateLimitDefOpt);

// Rate limiter w/ burst
// https://github.com/animir/node-rate-limiter-flexible/wiki/BurstyRateLimiter
const rateLimiterBursty = new BurstyRateLimiter(
	// First level of standard rate limit
	new RateLimiterRedis({
		...rateLimitDefOpt,
		storeClient: redis,
		insuranceLimiter: rateLimiterMemory, // Insurance if Redis goes down
	}),

	// Second level for burst
	new RateLimiterRedis({
		...rateLimitDefOpt,
		keyPrefix: "burst",
		storeClient: redis,
		insuranceLimiter: rateLimiterMemory, // Insurance if Redis goes down
		execEvenly: true, // Requests are executed evenly within duration
	})
);

// Express middleware to rate limit each request
const rateLimiterMiddleware = async (req, res, next) => {
	try {
		// Rate limited via IP
		await rateLimiterBursty.consume(req.ip);
		next();
	} catch (err) {
		res.sendStatus(429);
	}
};

export { rateLimiterMiddleware };
