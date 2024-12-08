import Queue from "bull";
import redis from "../config/redisConfig.js";

const vedioQueue = new Queue("vedioQueue", {
    redis: {
        host: redis.options.host,  // Directly pass redis client options if needed
        port: redis.options.port,  // Pass the configuration parameters
    }
})

/**
 * Add a Job to the Queue
 * @param {Object} data - Data for the email job
 */

//producer add jobs to the queue
const addVedioJob = async (data, delay) => {
    await vedioQueue.add(data, {
        attempts: 3,
        backoff: 5000,
        delay: delay
    });
};

export {
    vedioQueue,
    addVedioJob
}