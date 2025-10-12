const rateLimit = require('koa-ratelimit');

/**
 * Middleware de Rate Limiting para proteção contra brute force
 * Limita requisições por IP para endpoints sensíveis
 */
module.exports = (config, { strapi }) => {
  // Criar store em memória para rate limiting
  const db = new Map();

  return async (ctx, next) => {
    // Aplicar rate limiting apenas em rotas de autenticação
    const authRoutes = [
      '/api/auth/local',
      '/api/auth/local/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password'
    ];

    const isAuthRoute = authRoutes.some(route => ctx.path.startsWith(route));

    if (isAuthRoute) {
      // Configuração de rate limiting
      const limiter = rateLimit({
        driver: 'memory',
        db: db,
        duration: 60000 * 15, // 15 minutos
        errorMessage: 'Muitas tentativas. Tente novamente em 15 minutos.',
        id: (ctx) => ctx.ip,
        headers: {
          remaining: 'Rate-Limit-Remaining',
          reset: 'Rate-Limit-Reset',
          total: 'Rate-Limit-Total'
        },
        max: 5, // Máximo de 5 tentativas por IP a cada 15 minutos
        disableHeader: false,
        whitelist: (ctx) => {
          // Whitelist para IPs confiáveis (ex: localhost)
          return false;
        },
        blacklist: (ctx) => {
          // Blacklist para IPs bloqueados
          return false;
        }
      });

      await limiter(ctx, next);
    } else {
      // Não aplicar rate limiting para outras rotas
      await next();
    }
  };
};
