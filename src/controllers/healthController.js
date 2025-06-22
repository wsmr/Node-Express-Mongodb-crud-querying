/**
 * Health Controller
 * 
 * This file handles health check endpoints.
 */

const { getConnectionStatus } = require('../config/database');
const { CacheManager } = require('../config/cache');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

class HealthController {
  /**
   * Application health check
   * GET /api/health
   */
  static healthCheck = asyncHandler(async (req, res) => {
    const health = {
      status: 'UP',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    };

    res.status(HTTP_STATUS.OK).json(health);
  });

  /**
   * Detailed health check with dependencies
   * GET /api/health/detailed
   */
  static detailedHealthCheck = asyncHandler(async (req, res) => {
    const startTime = Date.now();

    // Check database connection
    const dbStatus = getConnectionStatus();
    const dbHealthy = dbStatus.status === 'connected';

    // Check cache
    let cacheHealthy = true;
    try {
      CacheManager.set('performance', 'health-check', 'test', 1);
      const testValue = CacheManager.get('performance', 'health-check');
      cacheHealthy = testValue === 'test';
      CacheManager.del('performance', 'health-check');
    } catch (error) {
      cacheHealthy = false;
    }

    const responseTime = Date.now() - startTime;
    const overallHealthy = dbHealthy && cacheHealthy;

    const health = {
      status: overallHealthy ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.floor(process.uptime()),
      responseTime: `${responseTime}ms`,
      checks: {
        database: {
          status: dbHealthy ? 'UP' : 'DOWN',
          details: dbStatus
        },
        cache: {
          status: cacheHealthy ? 'UP' : 'DOWN',
          stats: CacheManager.getStats()
        }
      },
      system: {
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024),
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
        },
        cpu: {
          usage: process.cpuUsage()
        },
        platform: process.platform,
        nodeVersion: process.version
      }
    };

    const statusCode = overallHealthy ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;
    res.status(statusCode).json(health);
  });

  /**
   * Readiness probe
   * GET /api/health/ready
   */
  static readinessCheck = asyncHandler(async (req, res) => {
    const dbStatus = getConnectionStatus();
    const ready = dbStatus.status === 'connected';

    const response = {
      ready,
      timestamp: new Date().toISOString(),
      checks: {
        database: dbStatus.status === 'connected'
      }
    };

    const statusCode = ready ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;
    res.status(statusCode).json(response);
  });

  /**
   * Liveness probe
   * GET /api/health/live
   */
  static livenessCheck = asyncHandler(async (req, res) => {
    const response = {
      alive: true,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime())
    };

    res.status(HTTP_STATUS.OK).json(response);
  });
}

module.exports = HealthController;

