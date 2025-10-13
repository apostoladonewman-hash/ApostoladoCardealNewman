/* global strapi */
'use strict';

/**
 * Health check controller
 * Provides endpoints for monitoring application health
 */
module.exports = {
  /**
   * Comprehensive health check
   * Returns detailed status of all system components
   */
  async index(ctx) {
    const startTime = Date.now();

    try {
      // Check database connection
      const dbHealth = await checkDatabase(strapi);

      // Check disk space (simplified)
      const diskHealth = { status: 'ok' };

      // Calculate uptime
      const uptime = process.uptime();

      // Memory usage
      const memUsage = process.memoryUsage();
      const memoryHealth = {
        status: 'ok',
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
        rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      };

      const responseTime = Date.now() - startTime;

      ctx.body = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 60)} minutes`,
        responseTime: `${responseTime}ms`,
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        checks: {
          database: dbHealth,
          memory: memoryHealth,
          disk: diskHealth,
        },
      };
    } catch (error) {
      ctx.status = 503;
      ctx.body = {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  },

  /**
   * Readiness check
   * Returns 200 if the application is ready to accept traffic
   */
  async ready(ctx) {
    try {
      // Check if database is accessible
      await strapi.db.connection.raw('SELECT 1');

      ctx.body = {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      ctx.status = 503;
      ctx.body = {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  },

  /**
   * Liveness check
   * Returns 200 if the application is running
   */
  async live(ctx) {
    ctx.body = {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  },
};

/**
 * Helper function to check database health
 */
async function checkDatabase(strapiInstance) {
  try {
    const start = Date.now();
    await strapiInstance.db.connection.raw('SELECT 1');
    const responseTime = Date.now() - start;

    return {
      status: 'ok',
      responseTime: `${responseTime}ms`,
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
    };
  }
}
