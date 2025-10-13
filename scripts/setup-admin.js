'use strict';

const path = require('path');

/**
 * Script para promover um usuário a Administrador via email.
 * Uso: node scripts/setup-admin.js <email_do_usuario>
 */
async function setupAdmin() {
  try {
    // Carregar Strapi manualmente para ter acesso aos serviços
    const strapiInstance = await require('@strapi/strapi')({
      appDir: path.join(__dirname, '..'),
      serveAdminPanel: false,
    });

    const email = process.argv[2];

    if (!email) {
      console.error(
        'Erro: Forneça o email do usuário a ser promovido como argumento.',
      );
      console.log('Uso: node scripts/setup-admin.js meu.email@exemplo.com');
      process.exit(1);
    }

    console.log(`Procurando usuário com email: ${email}...`);

    // Buscar o usuário pelo email
    const user = await strapiInstance
      .query('plugin::users-permissions.user')
      .findOne({
        where: { email: email.toLowerCase() },
      });

    if (!user) {
      console.error(`Erro: Usuário com email "${email}" não encontrado.`);
      process.exit(1);
    }

    console.log(`Usuário encontrado: ${user.username} (ID: ${user.id}).`);

    // Atualizar o campo user_level para 'Administrador'
    await strapiInstance.entityService.update(
      'plugin::users-permissions.user',
      user.id,
      {
        data: {
          user_level: 'Administrador',
        },
      },
    );

    console.log(
      `✅ Sucesso! O usuário ${user.username} foi promovido para Administrador.`,
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Ocorreu um erro no script:', error);
    process.exit(1);
  }
}

setupAdmin();
