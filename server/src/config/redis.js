const Redis = require('ioredis');

function createRedisClient({ host, port }) {
    const client = new Redis({ host, port });
    client.on('connect', () => console.log('🔌 Redis: connecting...'));
    client.on('ready', () => console.log('✅ Redis: ready'));
    client.on('error', (err) => console.error('❌ Redis error', err));
    client.on('close', () => console.log('🛑 Redis closed'));
    return client;
}

module.exports = createRedisClient;