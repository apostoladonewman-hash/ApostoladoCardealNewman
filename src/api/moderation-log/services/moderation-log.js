'use strict';

/**
 * moderation-log service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService(
  'api::moderation-log.moderation-log',
  ({ strapi }) => ({
    /**
     * Cria um log de moderação
     * @param {Object} data - Dados do log
     * @param {string} data.action - Ação realizada (approved, rejected, user_promoted, user_demoted)
     * @param {string} data.contentType - Tipo de conteúdo (article, testimonial, user)
     * @param {number} data.contentId - ID do conteúdo moderado
     * @param {number} data.moderatorId - ID do moderador
     * @param {string} data.reason - Razão da ação (opcional)
     * @param {Object} data.metadata - Metadados adicionais (opcional)
     */
    async createLog({
      action,
      contentType,
      contentId,
      moderatorId,
      reason,
      metadata,
    }) {
      try {
        const log = await strapi.entityService.create(
          'api::moderation-log.moderation-log',
          {
            data: {
              action,
              contentType,
              contentId,
              moderator: moderatorId,
              reason,
              metadata,
              publishedAt: new Date(),
            },
          },
        );

        strapi.log.info(
          `Log de moderação criado: ${action} em ${contentType} #${contentId} por moderador #${moderatorId}`,
        );
        return log;
      } catch (error) {
        strapi.log.error('Erro ao criar log de moderação:', error);
        throw error;
      }
    },

    /**
     * Busca logs de um moderador específico
     * @param {number} moderatorId - ID do moderador
     * @param {Object} options - Opções de paginação e filtros
     */
    async getLogsByModerator(moderatorId, options = {}) {
      const { page = 1, pageSize = 25, sort = 'createdAt:desc' } = options;

      return await strapi.entityService.findPage(
        'api::moderation-log.moderation-log',
        {
          filters: {
            moderator: {
              id: moderatorId,
            },
          },
          sort,
          page,
          pageSize,
          populate: ['moderator'],
        },
      );
    },

    /**
     * Busca logs de um conteúdo específico
     * @param {string} contentType - Tipo de conteúdo
     * @param {number} contentId - ID do conteúdo
     */
    async getLogsByContent(contentType, contentId) {
      return await strapi.entityService.findMany(
        'api::moderation-log.moderation-log',
        {
          filters: {
            contentType,
            contentId,
          },
          sort: 'createdAt:desc',
          populate: ['moderator'],
        },
      );
    },

    /**
     * Busca estatísticas de moderação
     * @param {Object} filters - Filtros opcionais (data inicial, data final, moderador)
     */
    async getModerationStats(filters = {}) {
      const { startDate, endDate, moderatorId } = filters;

      const baseFilters = {};

      if (startDate || endDate) {
        baseFilters.createdAt = {};
        if (startDate) baseFilters.createdAt.$gte = startDate;
        if (endDate) baseFilters.createdAt.$lte = endDate;
      }

      if (moderatorId) {
        baseFilters.moderator = { id: moderatorId };
      }

      const [approved, rejected, userPromoted, userDemoted] = await Promise.all(
        [
          strapi.entityService.count('api::moderation-log.moderation-log', {
            filters: { ...baseFilters, action: 'approved' },
          }),
          strapi.entityService.count('api::moderation-log.moderation-log', {
            filters: { ...baseFilters, action: 'rejected' },
          }),
          strapi.entityService.count('api::moderation-log.moderation-log', {
            filters: { ...baseFilters, action: 'user_promoted' },
          }),
          strapi.entityService.count('api::moderation-log.moderation-log', {
            filters: { ...baseFilters, action: 'user_demoted' },
          }),
        ],
      );

      return {
        approved,
        rejected,
        userPromoted,
        userDemoted,
        total: approved + rejected + userPromoted + userDemoted,
      };
    },
  }),
);
