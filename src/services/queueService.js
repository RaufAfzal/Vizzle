import Queue from "bull";
import redis from "../config/redisConfig.js";


//create a queue for email jobs
const emailQueue = new Queue("emailQueue", {
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
const addEmailJob = async (data) => {
    await emailQueue.add(data, { attempts: 3, backoff: 5000 });
}

export {
    emailQueue,
    addEmailJob
}