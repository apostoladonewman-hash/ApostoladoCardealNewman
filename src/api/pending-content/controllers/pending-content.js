module.exports = {
  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Você precisa estar autenticado para criar conteúdo.');
    }

    // Verificar se o usuário tem permissão para contribuir
    if (!user.pode_contribuir && user.role.type !== 'admin') {
      return ctx.forbidden('Você não tem permissão para contribuir com conteúdo.');
    }

    try {
      const { tipo_conteudo, titulo, conteudo, categoria } = ctx.request.body.data;

      // Validar dados obrigatórios
      if (!tipo_conteudo || !titulo || !conteudo) {
        return ctx.badRequest('Campos obrigatórios: tipo_conteudo, titulo, conteudo');
      }

      // Validar tipo de conteúdo
      const tiposValidos = ['article', 'testimony', 'comment'];
      if (!tiposValidos.includes(tipo_conteudo)) {
        return ctx.badRequest('Tipo de conteúdo inválido');
      }

      // Sanitizar título
      const tituloSanitizado = titulo.trim().substring(0, 255);
      if (tituloSanitizado.length < 3) {
        return ctx.badRequest('Título deve ter pelo menos 3 caracteres');
      }

      const pendingContent = await strapi.entityService.create(
        'api::pending-content.pending-content',
        {
          data: {
            tipo_conteudo,
            titulo: tituloSanitizado,
            conteudo,
            categoria,
            autor_contribuidor: user.id,
            status_aprovacao: 'pending',
            data_submissao: new Date(),
            publishedAt: new Date()
          }
        }
      );

      return ctx.send({
        data: pendingContent,
        message: 'Conteúdo enviado para aprovação com sucesso!'
      });
    } catch (error) {
      return ctx.badRequest('Erro ao criar conteúdo pendente', { error });
    }
  },

  async approve(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;

    if (!user || user.role.type !== 'admin') {
      return ctx.forbidden('Apenas administradores podem aprovar conteúdo.');
    }

    try {
      const pendingContent = await strapi.entityService.findOne(
        'api::pending-content.pending-content',
        id,
        {
          populate: ['categoria', 'autor_contribuidor']
        }
      );

      if (!pendingContent) {
        return ctx.notFound('Conteúdo pendente não encontrado.');
      }

      // Criar o artigo aprovado
      if (pendingContent.tipo_conteudo === 'article') {
        const articleData = {
          title: pendingContent.titulo,
          content: pendingContent.conteudo,
          user: pendingContent.autor_contribuidor?.id,
          publishedAt: new Date()
        };

        // Adicionar categoria apenas se existir
        if (pendingContent.categoria?.id) {
          articleData.category = pendingContent.categoria.id;
        }

        // Adicionar author apenas se existir
        if (pendingContent.autor_contribuidor?.autor_vinculado?.id) {
          articleData.author = pendingContent.autor_contribuidor.autor_vinculado.id;
        }

        const newArticle = await strapi.entityService.create('api::article.article', {
          data: articleData
        });

        // Atualizar o status do conteúdo pendente
        await strapi.entityService.update(
          'api::pending-content.pending-content',
          id,
          {
            data: {
              status_aprovacao: 'approved',
              aprovado_por: user.id,
              data_aprovacao: new Date()
            }
          }
        );

        return ctx.send({
          data: newArticle,
          message: 'Conteúdo aprovado e publicado com sucesso!'
        });
      }

      return ctx.badRequest('Tipo de conteúdo não suportado.');
    } catch (error) {
      return ctx.badRequest('Erro ao aprovar conteúdo', { error });
    }
  },

  async reject(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;
    const { motivo_rejeicao } = ctx.request.body.data;

    if (!user || user.role.type !== 'admin') {
      return ctx.forbidden('Apenas administradores podem rejeitar conteúdo.');
    }

    try {
      const updatedContent = await strapi.entityService.update(
        'api::pending-content.pending-content',
        id,
        {
          data: {
            status_aprovacao: 'rejected',
            motivo_rejeicao,
            aprovado_por: user.id,
            data_aprovacao: new Date()
          }
        }
      );

      return ctx.send({
        data: updatedContent,
        message: 'Conteúdo rejeitado com sucesso!'
      });
    } catch (error) {
      return ctx.badRequest('Erro ao rejeitar conteúdo', { error });
    }
  },

  async findPending(ctx) {
    const user = ctx.state.user;

    if (!user || user.role.type !== 'admin') {
      return ctx.forbidden('Apenas administradores podem ver conteúdos pendentes.');
    }

    try {
      const pendingContents = await strapi.entityService.findMany(
        'api::pending-content.pending-content',
        {
          filters: {
            status_aprovacao: 'pending'
          },
          populate: ['autor_contribuidor', 'categoria'],
          sort: { data_submissao: 'desc' }
        }
      );

      return ctx.send({ data: pendingContents });
    } catch (error) {
      return ctx.badRequest('Erro ao buscar conteúdos pendentes', { error });
    }
  }
};
