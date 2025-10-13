// Caminho do arquivo: src/middlewares/rate-limit.js

'use strict';

const rateLimit = require('koa-ratelimit');
const { RateLimitError } = require('@strapi/utils').errors;

module.exports = (config) => {
  return async (ctx, next) => {
    const limiter = rateLimit({
      driver: 'memory',
      db: new Map(),
      duration: config.duration || 60000, // 1 minuto
      errorMessage: 'Too many requests, please try again later.',
      id: (context) => context.ip,
      headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total',
      },
      max: config.max || 5,
      disableHeader: false,
      throw: true,
    });

    try {
      await limiter(ctx);
      await next();
    } catch (error) {
      if (error.status === 429) {
        throw new RateLimitError(error.message, {
          remaining: error.headers['Rate-Limit-Remaining'],
          reset: error.headers['Rate-Limit-Reset'],
        });
      }
      throw error;
    }
  };
};
