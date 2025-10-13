/* global strapi */
'use strict';

const emailService = require('../../../../services/emailNotification');

/**
 * Lifecycle callbacks for the `article` content-type.
 */
module.exports = {
  async afterUpdate(event) {
    const { result, params, state } = event;

    // Confere se a atualização foi nos dados e se há um resultado
    if (params.data && result) {
      const statusMudou = params.data.status;
      const statusAprovado = statusMudou === 'approved';
      const statusRejeitado = statusMudou === 'rejected';

      // Executa a lógica apenas se o status foi alterado para 'approved' ou 'rejected'
      if (statusAprovado || statusRejeitado) {
        const articleId = result.id;

        // Busca o artigo completo com a população do usuário vinculado
        const article = await strapi.entityService.findOne(
          'api::article.article',
          articleId,
          {
            populate: ['usuario_vinculado'],
          },
        );

        // Garante que o artigo e o usuário vinculado existem antes de prosseguir
        if (!article || !article.usuario_vinculado) {
          strapi.log.warn(
            `Artigo ${articleId} ou seu usuário vinculado não encontrado para notificação.`,
          );
          return;
        }

        const user = article.usuario_vinculado;
        const userEmail = user.email;
        const userName = user.username || user.nome_completo || 'Usuário';
        const articleTitle = article.titulo || 'Seu artigo';

        try {
          // Lógica de envio de email e criação de log
          if (statusAprovado) {
            await emailService.sendArticleApproved(
              userEmail,
              userName,
              articleTitle,
              articleId,
            );

            if (state && state.user) {
              await strapi
                .service('api::moderation-log.moderation-log')
                .createLog({
                  action: 'approved',
                  contentType: 'article',
                  contentId: articleId,
                  moderatorId: state.user.id,
                });
            }
          } else if (statusRejeitado) {
            const reason = params.data.motivo_rejeicao || 'Não especificado';
            await emailService.sendArticleRejected(
              userEmail,
              userName,
              articleTitle,
              reason,
            );

            if (state && state.user) {
              await strapi
                .service('api::moderation-log.moderation-log')
                .createLog({
                  action: 'rejected',
                  contentType: 'article',
                  contentId: articleId,
                  moderatorId: state.user.id,
                  reason,
                });
            }
          }
        } catch (error) {
          strapi.log.error(
            `Erro ao processar afterUpdate para o artigo ${articleId}:`,
            error,
          );
        }
      }
    }
  },
};
