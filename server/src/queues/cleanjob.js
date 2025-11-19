const Queue = require('bull');
const q = new Queue('jobQueue', { redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, password: process.env.REDIS_PASS } });

async function clean() {
    await q.clean(0, 'completed');
    await q.clean(0, 'failed');
    await q.clean(0, 'wait');
    await q.clean(0, 'active');

    console.log("Cleanup done.");
    process.exit(0);
}

clean();
