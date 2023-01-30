import Redis from "ioredis";

const { REDIS_HOST, REDIS_PORT, REDIS_AUTH } = process.env;

// Redis options
export const redisOpts = {
	host: REDIS_HOST,
	port: REDIS_PORT,
	...(REDIS_AUTH && { password: REDIS_AUTH }),
	enableOfflineQueue: false,
	retryStrategy: () => 1000, // Retry connection every 1s
};

// Initialize Redis
export const initRedis = (db) => new Redis({ ...redisOpts, db });
