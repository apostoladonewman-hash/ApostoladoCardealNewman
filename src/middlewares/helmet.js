/**
 * Helmet middleware for security headers
 * Implements comprehensive HTTP security headers
 * CSP is disabled in development to avoid CORS issues
 */

const helmet = require('helmet');

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const isDevelopment = strapi.config.environment === 'development';

    // Apply Helmet middleware with Koa-compatible wrapper
    const helmetMiddleware = helmet({
      // Content Security Policy - Desabilitado em desenvolvimento
      contentSecurityPolicy: isDevelopment ? false : {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      // Strict Transport Security (HSTS) - Desabilitado em desenvolvimento
      hsts: isDevelopment ? false : {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      // Cross-Origin-Embedder-Policy - Desabilitado em desenvolvimento para permitir imagens
      crossOriginEmbedderPolicy: isDevelopment ? false : true,
      // Cross-Origin-Opener-Policy - Desabilitado em desenvolvimento
      crossOriginOpenerPolicy: isDevelopment ? false : { policy: 'same-origin' },
      // Cross-Origin-Resource-Policy - Desabilitado em desenvolvimento para permitir imagens cross-origin
      crossOriginResourcePolicy: isDevelopment ? false : { policy: 'same-origin' },
      // X-Frame-Options
      frameguard: {
        action: 'deny',
      },
      // X-Content-Type-Options
      noSniff: true,
      // X-XSS-Protection
      xssFilter: true,
      // Referrer Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      // X-DNS-Prefetch-Control
      dnsPrefetchControl: {
        allow: false,
      },
      // X-Download-Options
      ieNoOpen: true,
      // X-Permitted-Cross-Domain-Policies
      permittedCrossDomainPolicies: {
        permittedPolicies: 'none',
      },
    });

    // Wrap Express middleware for Koa
    await new Promise((resolve, reject) => {
      const req = {
        headers: ctx.request.headers,
        get: (header) => ctx.get(header),
      };

      const res = {
        setHeader: (key, value) => ctx.set(key, value),
        getHeader: (key) => ctx.get(key),
        removeHeader: (key) => ctx.remove(key),
      };

      helmetMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await next();
  };
};
