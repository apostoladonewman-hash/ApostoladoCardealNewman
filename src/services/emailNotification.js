/* global strapi */

/**
 * Email Notification Service
 * Envia emails de notificação para usuários sobre moderação
 */

module.exports = {
  /**
   * Envia email de aprovação de testemunho
   */
  async sendTestimonialApproved(userEmail, userName, testimonialId) {
    try {
      await strapi.plugins['email'].services.email.send({
        to: userEmail,
        from: 'apostoladonewman@gmail.com',
        subject: 'Seu testemunho foi aprovado! - Apostolado Cardeal Newman',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
              }
              .header {
                background-color: #8B4513;
                color: white;
                padding: 20px;
                text-align: center;
              }
              .content {
                background-color: white;
                padding: 20px;
                margin-top: 20px;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #8B4513;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Apostolado Cardeal Newman</h1>
              </div>
              <div class="content">
                <h2>Parabéns, ${userName}!</h2>
                <p>Seu testemunho foi aprovado pela nossa equipe de moderação e agora está publicado no site.</p>
                <p>Agradecemos por compartilhar sua história de fé conosco. Seu testemunho pode inspirar muitas pessoas em sua jornada de conversão.</p>
                <a href="http://localhost:5173/testemunhos/${testimonialId}" class="button">Ver Testemunho Publicado</a>
              </div>
              <div class="footer">
                <p>Apostolado Cardeal Newman</p>
                <p>Este é um email automático, não responda.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      strapi.log.info(
        `Email de aprovação de testemunho enviado para ${userEmail}`,
      );
    } catch (error) {
      strapi.log.error('Erro ao enviar email de aprovação:', error);
    }
  },

  /**
   * Envia email de rejeição de testemunho
   */
  async sendTestimonialRejected(userEmail, userName, reason) {
    try {
      await strapi.plugins['email'].services.email.send({
        to: userEmail,
        from: 'apostoladonewman@gmail.com',
        subject: 'Atualização sobre seu testemunho - Apostolado Cardeal Newman',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
              }
              .header {
                background-color: #8B4513;
                color: white;
                padding: 20px;
                text-align: center;
              }
              .content {
                background-color: white;
                padding: 20px;
                margin-top: 20px;
              }
              .reason-box {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #8B4513;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Apostolado Cardeal Newman</h1>
              </div>
              <div class="content">
                <h2>Olá, ${userName}</h2>
                <p>Agradecemos por enviar seu testemunho. Após revisão, nossa equipe identificou alguns pontos que precisam ser ajustados:</p>
                <div class="reason-box">
                  <strong>Motivo:</strong>
                  <p>${reason || 'Não especificado'}</p>
                </div>
                <p>Por favor, edite seu testemunho considerando as observações acima e reenvie para nova análise.</p>
                <a href="http://localhost:5173/meu-testemunho" class="button">Editar Testemunho</a>
              </div>
              <div class="footer">
                <p>Apostolado Cardeal Newman</p>
                <p>Este é um email automático, não responda.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      strapi.log.info(
        `Email de rejeição de testemunho enviado para ${userEmail}`,
      );
    } catch (error) {
      strapi.log.error('Erro ao enviar email de rejeição:', error);
    }
  },

  /**
   * Envia email de aprovação de artigo
   */
  async sendArticleApproved(userEmail, userName, articleTitle, articleId) {
    try {
      await strapi.plugins['email'].services.email.send({
        to: userEmail,
        from: 'apostoladonewman@gmail.com',
        subject: 'Seu artigo foi aprovado! - Apostolado Cardeal Newman',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
              }
              .header {
                background-color: #8B4513;
                color: white;
                padding: 20px;
                text-align: center;
              }
              .content {
                background-color: white;
                padding: 20px;
                margin-top: 20px;
              }
              .article-title {
                background-color: #e7f3ff;
                border-left: 4px solid #2196F3;
                padding: 15px;
                margin: 20px 0;
                font-style: italic;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #8B4513;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Apostolado Cardeal Newman</h1>
              </div>
              <div class="content">
                <h2>Excelente notícia, ${userName}!</h2>
                <p>Seu artigo foi aprovado e está agora publicado no site do Apostolado Cardeal Newman.</p>
                <div class="article-title">
                  <strong>"${articleTitle}"</strong>
                </div>
                <p>Agradecemos sua contribuição para a formação e evangelização dos nossos leitores.</p>
                <a href="http://localhost:5173/artigos/${articleId}" class="button">Ver Artigo Publicado</a>
              </div>
              <div class="footer">
                <p>Apostolado Cardeal Newman</p>
                <p>Este é um email automático, não responda.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      strapi.log.info(`Email de aprovação de artigo enviado para ${userEmail}`);
    } catch (error) {
      strapi.log.error('Erro ao enviar email de aprovação de artigo:', error);
    }
  },

  /**
   * Envia email de rejeição de artigo
   */
  async sendArticleRejected(userEmail, userName, articleTitle, reason) {
    try {
      await strapi.plugins['email'].services.email.send({
        to: userEmail,
        from: 'apostoladonewman@gmail.com',
        subject: 'Atualização sobre seu artigo - Apostolado Cardeal Newman',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
              }
              .header {
                background-color: #8B4513;
                color: white;
                padding: 20px;
                text-align: center;
              }
              .content {
                background-color: white;
                padding: 20px;
                margin-top: 20px;
              }
              .article-title {
                background-color: #e7f3ff;
                border-left: 4px solid #2196F3;
                padding: 15px;
                margin: 20px 0;
                font-style: italic;
              }
              .reason-box {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #8B4513;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Apostolado Cardeal Newman</h1>
              </div>
              <div class="content">
                <h2>Olá, ${userName}</h2>
                <p>Agradecemos por enviar seu artigo para o Apostolado Cardeal Newman.</p>
                <div class="article-title">
                  <strong>"${articleTitle}"</strong>
                </div>
                <p>Após revisão editorial, identificamos alguns pontos que precisam ser ajustados:</p>
                <div class="reason-box">
                  <strong>Motivo:</strong>
                  <p>${reason || 'Não especificado'}</p>
                </div>
                <p>Por favor, revise seu artigo considerando as observações acima e reenvie para nova análise.</p>
                <a href="http://localhost:5173/meus-artigos" class="button">Ver Meus Artigos</a>
              </div>
              <div class="footer">
                <p>Apostolado Cardeal Newman</p>
                <p>Este é um email automático, não responda.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      strapi.log.info(`Email de rejeição de artigo enviado para ${userEmail}`);
    } catch (error) {
      strapi.log.error('Erro ao enviar email de rejeição de artigo:', error);
    }
  },
};
