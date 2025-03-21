const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on('error', (error) => {
      console.log(error);
    });

    this._client.connect();
  }

  async _set(key, value, expirationInSeconds = 30 * 60) {
    await this._client.set(key, value, {
      EX: expirationInSeconds,
    });
  }

  async _get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');

    return result;
  }

  async remember(key, defaultValue = async () => {}) {
    try {
      const data = await this._get(key);
      return { fromCache: true, data: JSON.parse(data) };
    } catch (error) {
      if (typeof defaultValue !== 'function') return defaultValue;

      const data = await defaultValue();
      await this._set(key, JSON.stringify(data));

      return { fromCache: false, data };
    }
  }

  async forget(key) {
    await this._client.del(key);
  }
}

module.exports = CacheService;
