import IORedis from "ioredis";

const redis = new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379
});

export default redis;