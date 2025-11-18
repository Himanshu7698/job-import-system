const Queue = require('bull');

function createJobQueue(redisConfig) {
    const q = new Queue('jobQueue', {
        redis: redisConfig,
    });

    q.on('error', (err) => console.error('Bull queue error', err));
    q.on('active', (job) => console.log(`Queue active: id=${job.id}`));
    q.on('completed', (job) => console.log(`Queue completed: id=${job.id}`));
    q.on('failed', (job, err) => console.error(`Queue failed id=${job.id}`, err));

    return q;
}

module.exports = createJobQueue;