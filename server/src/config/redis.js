const Redis = require('ioredis');

function createRedisClient({ host, port, password }) {
    const client = new Redis({ host, port, password, tls: {},  });
    client.on('connect', () => console.log('🔌 Redis: connecting...'));
    client.on('ready', () => console.log('✅ Redis: ready'));
    client.on('error', (err) => console.error('❌ Redis error', err));
    client.on('close', () => console.log('🛑 Redis closed'));
    return client;
}

module.exports = createRedisClient;