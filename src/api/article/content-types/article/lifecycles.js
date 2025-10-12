const emailService = require('../../../../services/emailNotification');

module.exports = {
  async afterUpdate(event) {
    const { result, params } = event;

    // Verificar se o status mudou para approved ou rejected
    if (params.data.status && result) {
      const articleId = result.id;

      // Buscar dados completos do article com usuário vinculado
      const article = await strapi.entityService.findOne('api::article.article', articleId, {
        populate: ['usuario_vinculado'],
      });

      if (!article || !article.usuario_vinculado) {
        return;
      }

      const user = article.usuario_vinculado;
      const userEmail = user.email;
      const userName = user.username || user.nome_completo || 'Usuário';
      const articleTitle = article.titulo || 'Seu artigo';

      // Enviar email baseado no status
      if (params.data.status === 'approved') {
        await emailService.sendArticleApproved(userEmail, userName, articleTitle, articleId);

        // Criar log de moderação
        if (event.state && event.state.user) {
          await strapi.service('api::moderation-log.moderation-log').createLog({
            action: 'approved',
            contentType: 'article',
            contentId: articleId,
            moderatorId: event.state.user.id,
          });
        }
      } else if (params.data.status === 'rejected') {
        const reason = params.data.motivo_rejeicao || 'Não especificado';
        await emailService.sendArticleRejected(userEmail, userName, articleTitle, reason);

        // Criar log de moderação
        if (event.state && event.state.user) {
          await strapi.service('api::moderation-log.moderation-log').createLog({
            action: 'rejected',
            contentType: 'article',
            contentId: articleId,
            moderatorId: event.state.user.id,
            reason,
          });
        }
      }
    }
  },
};
