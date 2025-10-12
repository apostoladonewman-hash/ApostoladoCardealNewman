'use strict';

/**
 * moderation-log controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::moderation-log.moderation-log', ({ strapi }) => ({
  /**
   * Busca logs de moderação com filtros
   * GET /api/moderation-logs
   */
  async find(ctx) {
    const { moderatorId, contentType, contentId, action } = ctx.query;

    const filters = {};

    if (moderatorId) {
      filters.moderator = { id: moderatorId };
    }

    if (contentType) {
      filters.contentType = contentType;
    }

    if (contentId) {
      filters.contentId = contentId;
    }

    if (action) {
      filters.action = action;
    }

    const logs = await strapi.entityService.findMany('api::moderation-log.moderation-log', {
      filters,
      sort: 'createdAt:desc',
      populate: ['moderator'],
      ...ctx.query,
    });

    return logs;
  },

  /**
   * Busca logs de um moderador específico
   * GET /api/moderation-logs/by-moderator/:moderatorId
   */
  async findByModerator(ctx) {
    const { moderatorId } = ctx.params;
    const logs = await strapi.service('api::moderation-log.moderation-log').getLogsByModerator(
      parseInt(moderatorId),
      ctx.query
    );

    return logs;
  },

  /**
   * Busca logs de um conteúdo específico
   * GET /api/moderation-logs/by-content/:contentType/:contentId
   */
  async findByContent(ctx) {
    const { contentType, contentId } = ctx.params;

    if (!['article', 'testimonial', 'user'].includes(contentType)) {
      return ctx.badRequest('Invalid content type');
    }

    const logs = await strapi.service('api::moderation-log.moderation-log').getLogsByContent(
      contentType,
      parseInt(contentId)
    );

    return logs;
  },

  /**
   * Busca estatísticas de moderação
   * GET /api/moderation-logs/stats
   */
  async stats(ctx) {
    const { startDate, endDate, moderatorId } = ctx.query;

    const stats = await strapi.service('api::moderation-log.moderation-log').getModerationStats({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      moderatorId: moderatorId ? parseInt(moderatorId) : undefined,
    });

    return stats;
  },

  /**
   * Cria um log de moderação
   * POST /api/moderation-logs
   * (Este método normalmente seria chamado internamente, não diretamente)
   */
  async create(ctx) {
    const { action, contentType, contentId, reason, metadata } = ctx.request.body;

    // Verificar se o usuário é moderador ou admin
    const user = ctx.state.user;
    if (!user || (user.userLevel !== 'Moderador' && user.userLevel !== 'Administrador')) {
      return ctx.forbidden('Você não tem permissão para criar logs de moderação');
    }

    if (!action || !contentType || !contentId) {
      return ctx.badRequest('action, contentType e contentId são obrigatórios');
    }

    if (!['approved', 'rejected', 'user_promoted', 'user_demoted'].includes(action)) {
      return ctx.badRequest('action inválido');
    }

    if (!['article', 'testimonial', 'user'].includes(contentType)) {
      return ctx.badRequest('contentType inválido');
    }

    const log = await strapi.service('api::moderation-log.moderation-log').createLog({
      action,
      contentType,
      contentId,
      moderatorId: user.id,
      reason,
      metadata,
    });

    return log;
  },
}));
