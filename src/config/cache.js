/**
 * Cache Configuration
 * 
 * This file configures the caching system for the application.
 */

const NodeCache = require('node-cache');

/**
 * Cache configuration options
 */
const cacheOptions = {
  stdTTL: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour default
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false, // Don't clone objects for better performance
  deleteOnExpire: true,
  maxKeys: parseInt(process.env.CACHE_MAX_KEYS) || 1000
};

/**
 * Create cache instances for different data types
 */
const caches = {
  users: new NodeCache({ ...cacheOptions, stdTTL: 1800 }), // 30 minutes
  universities: new NodeCache({ ...cacheOptions, stdTTL: 3600 }), // 1 hour
  faculties: new NodeCache({ ...cacheOptions, stdTTL: 3600 }), // 1 hour
  carts: new NodeCache({ ...cacheOptions, stdTTL: 900 }), // 15 minutes
  queries: new NodeCache({ ...cacheOptions, stdTTL: 7200 }), // 2 hours
  performance: new NodeCache({ ...cacheOptions, stdTTL: 300 }) // 5 minutes
};

/**
 * Cache utility functions
 */
class CacheManager {
  /**
   * Get value from specific cache
   */
  static get(cacheName, key) {
    const cache = caches[cacheName];
    if (!cache) {
      throw new Error(`Cache '${cacheName}' not found`);
    }
    return cache.get(key);
  }

  /**
   * Set value in specific cache
   */
  static set(cacheName, key, value, ttl = null) {
    const cache = caches[cacheName];
    if (!cache) {
      throw new Error(`Cache '${cacheName}' not found`);
    }
    return cache.set(key, value, ttl);
  }

  /**
   * Delete value from specific cache
   */
  static del(cacheName, key) {
    const cache = caches[cacheName];
    if (!cache) {
      throw new Error(`Cache '${cacheName}' not found`);
    }
    return cache.del(key);
  }

  /**
   * Check if key exists in specific cache
   */
  static has(cacheName, key) {
    const cache = caches[cacheName];
    if (!cache) {
      throw new Error(`Cache '${cacheName}' not found`);
    }
    return cache.has(key);
  }

  /**
   * Clear specific cache
   */
  static clear(cacheName) {
    const cache = caches[cacheName];
    if (!cache) {
      throw new Error(`Cache '${cacheName}' not found`);
    }
    return cache.flushAll();
  }

  /**
   * Clear all caches
   */
  static clearAll() {
    Object.keys(caches).forEach(cacheName => {
      caches[cacheName].flushAll();
    });
    return true;
  }

  /**
   * Get cache statistics
   */
  static getStats(cacheName = null) {
    if (cacheName) {
      const cache = caches[cacheName];
      if (!cache) {
        throw new Error(`Cache '${cacheName}' not found`);
      }
      return {
        [cacheName]: cache.getStats()
      };
    }

    const stats = {};
    Object.keys(caches).forEach(name => {
      stats[name] = caches[name].getStats();
    });
    return stats;
  }

  /**
   * Get all cache keys
   */
  static getKeys(cacheName) {
    const cache = caches[cacheName];
    if (!cache) {
      throw new Error(`Cache '${cacheName}' not found`);
    }
    return cache.keys();
  }

  /**
   * Get cache size
   */
  static getSize(cacheName) {
    const cache = caches[cacheName];
    if (!cache) {
      throw new Error(`Cache '${cacheName}' not found`);
    }
    return cache.keys().length;
  }

  /**
   * Set TTL for existing key
   */
  static setTTL(cacheName, key, ttl) {
    const cache = caches[cacheName];
    if (!cache) {
      throw new Error(`Cache '${cacheName}' not found`);
    }
    return cache.ttl(key, ttl);
  }

  /**
   * Get TTL for key
   */
  static getTTL(cacheName, key) {
    const cache = caches[cacheName];
    if (!cache) {
      throw new Error(`Cache '${cacheName}' not found`);
    }
    return cache.getTtl(key);
  }
}

/**
 * Cache middleware for Express routes
 */
function cacheMiddleware(cacheName, keyGenerator, ttl = null) {
  return (req, res, next) => {
    try {
      const key = typeof keyGenerator === 'function' 
        ? keyGenerator(req) 
        : keyGenerator;

      const cachedData = CacheManager.get(cacheName, key);
      
      if (cachedData) {
        return res.json(cachedData);
      }

      // Store original json method
      const originalJson = res.json;

      // Override json method to cache response
      res.json = function(data) {
        if (res.statusCode === 200) {
          CacheManager.set(cacheName, key, data, ttl);
        }
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}

/**
 * Initialize cache event listeners
 */
function initializeCacheEvents() {
  Object.keys(caches).forEach(cacheName => {
    const cache = caches[cacheName];
    
    cache.on('set', (key, value) => {
      console.log(`📦 Cache SET [${cacheName}]: ${key}`);
    });

    cache.on('del', (key, value) => {
      console.log(`🗑️ Cache DEL [${cacheName}]: ${key}`);
    });

    cache.on('expired', (key, value) => {
      console.log(`⏰ Cache EXPIRED [${cacheName}]: ${key}`);
    });

    cache.on('flush', () => {
      console.log(`🧹 Cache FLUSH [${cacheName}]`);
    });
  });
}

// Initialize cache events in development
if (process.env.NODE_ENV === 'development') {
  initializeCacheEvents();
}

module.exports = {
  caches,
  CacheManager,
  cacheMiddleware
};

