const Queue = require("bull");

function createJobQueue(redisConfig) {
    const q = new Queue("jobQueue", {
        redis: {
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASS || undefined,
            maxRetriesPerRequest: null,
            enableReadyCheck: false
        },
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: true,
            attempts: 3,
            backoff: {
                type: "fixed",
                delay: 2000
            }
        }
    });

    // --- Queue Events ---
    q.on("error", (err) => console.error("❌ Bull queue error:", err));
    q.on("waiting", (jobId) => console.log(`⌛ Job waiting: id=${jobId}`));
    q.on("active", (job) => console.log(`▶️ Job active: id=${job.id}`));
    q.on("completed", (job) => console.log(`✅ Job completed: id=${job.id}`));
    q.on("failed", (job, err) =>
        console.error(`🔥 Job failed: id=${job.id}`, err)
    );

    return q;
}

module.exports = createJobQueue;
