import Bull from "bull";  // Import the default Bull class
console.log("Bull is", Bull);

// Create a scheduler for delayed jobs and retries using the Bull class
const scheduler = new Bull('emailQueue', {
    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379
    }
});

// Create a worker to process jobs from the queue
const worker = new Bull.Worker(
    'emailQueue',
    async (job) => {
        const { to, type, data } = job.data;

        let subject, html;

        switch (type) {
            case 'registration':
                subject = "Welcome to vizzy";
                html = registrationTemplate(data);
                break;
            case 'login':
                subject = "Login Alert";
                html = loginNotificationTemplate(data);
                break;
            default:
                throw new ApiError(400, "Invalid Email Type");
        }

        // Send email using your service (e.g., using nodemailer)
        await sendEmail(to, subject, html);
        console.log(`Email sent to ${to}`);
    },
    {
        limiter: {
            max: 5,
            duration: 1000
        },
        attempts: 3,
        backoff: 5000,
        concurrency: 3
    }
);

// Event handling for job completion, failure, etc.
worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err);
});

worker.on('active', (job) => {
    console.log(`Job ${job.id} is now being processed`);
});

worker.on('stalled', (job) => {
    console.warn(`Job ${job.id} has stalled`);
});

worker.on('error', (err) => {
    console.error('Worker encountered an error:', err);
});

// Graceful shutdown
const shutdown = async () => {
    try {
        console.log('Shutting down worker...');
        await worker.close();
        await scheduler.close();
        console.log('Worker and scheduler shutdown completed.');
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

// Handle termination signals for graceful shutdown
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('Worker started. Listening for jobs...');
