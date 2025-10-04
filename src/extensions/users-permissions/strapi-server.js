module.exports = (plugin) => {
  // Adicionar lifecycle hook para associação automática de usuários
  const originalRegister = plugin.controllers.auth.register;

  plugin.controllers.auth.register = async (ctx) => {
    // Executar o registro original
    await originalRegister(ctx);

    // Se o registro foi bem-sucedido, verificar se existe um autor com o mesmo nome
    if (ctx.response.status === 200 && ctx.response.body.user) {
      const user = ctx.response.body.user;
      const nomeCompleto = ctx.request.body.nome_completo;

      if (nomeCompleto) {
        try {
          // Buscar autor com o mesmo nome
          const authors = await strapi.entityService.findMany('api::author.author', {
            filters: {
              nome_pessoa: {
                $eqi: nomeCompleto.trim()
              }
            },
            limit: 1
          });

          if (authors && authors.length > 0) {
            // Associar o usuário ao autor encontrado
            await strapi.entityService.update('plugin::users-permissions.user', user.id, {
              data: {
                autor_vinculado: authors[0].id
              }
            });

            strapi.log.info(`Usuário ${user.id} associado automaticamente ao autor ${authors[0].id}`);
          }
        } catch (error) {
          strapi.log.error('Erro ao associar usuário ao autor:', error);
        }
      }
    }
  };

  // Customizar a resposta de login para incluir informações adicionais
  const originalCallback = plugin.controllers.auth.callback;

  plugin.controllers.auth.callback = async (ctx) => {
    await originalCallback(ctx);

    // Adicionar informações do perfil do usuário na resposta
    if (ctx.response.body && ctx.response.body.user) {
      const userId = ctx.response.body.user.id;

      const userWithDetails = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        userId,
        {
          populate: ['role', 'autor_vinculado', 'foto_perfil']
        }
      );

      ctx.response.body.user = {
        ...ctx.response.body.user,
        nome_completo: userWithDetails.nome_completo,
        foto_perfil: userWithDetails.foto_perfil,
        biografia: userWithDetails.biografia,
        denominacao_anterior: userWithDetails.denominacao_anterior,
        profissao: userWithDetails.profissao,
        ex_protestante: userWithDetails.ex_protestante,
        pode_contribuir: userWithDetails.pode_contribuir,
        autor_vinculado: userWithDetails.autor_vinculado,
        role: userWithDetails.role
      };
    }
  };

  return plugin;
};
