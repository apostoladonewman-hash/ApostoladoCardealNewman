/* global strapi */
'use strict';

const emailService = require('../../../../services/emailNotification');

module.exports = {
  async afterUpdate(event) {
    const { result, params, state } = event;

    // Verificar se o status mudou para approved ou rejected
    if (params.data.status && result) {
      const authorId = result.id;

      // Buscar dados completos do author com usuário vinculado
      const author = await strapi.entityService.findOne(
        'api::author.author',
        authorId,
        {
          populate: ['usuario_vinculado'],
        },
      );

      if (!author || !author.usuario_vinculado) {
        return;
      }

      const user = author.usuario_vinculado;
      const userEmail = user.email;
      const userName = user.username || user.nome_completo || 'Usuário';

      // Enviar email baseado no status
      if (params.data.status === 'approved') {
        await emailService.sendTestimonialApproved(
          userEmail,
          userName,
          authorId,
        );

        // Criar log de moderação
        if (state && state.user) {
          await strapi.service('api::moderation-log.moderation-log').createLog({
            action: 'approved',
            contentType: 'testimonial',
            contentId: authorId,
            moderatorId: state.user.id,
          });
        }
      } else if (params.data.status === 'rejected') {
        const reason = params.data.motivo_rejeicao || 'Não especificado';
        await emailService.sendTestimonialRejected(userEmail, userName, reason);

        // Criar log de moderação
        if (state && state.user) {
          await strapi.service('api::moderation-log.moderation-log').createLog({
            action: 'rejected',
            contentType: 'testimonial',
            contentId: authorId,
            moderatorId: state.user.id,
            reason,
          });
        }
      }
    }
  },
};
