const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

module.exports = {
  /**
   * Gera um novo secret para 2FA
   */
  generateSecret(userEmail) {
    const secret = speakeasy.generateSecret({
      name: `Apostolado Newman (${userEmail})`,
      issuer: 'Apostolado Cardeal Newman',
    });

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url,
    };
  },

  /**
   * Gera QR Code em base64
   */
  async generateQRCode(otpauthUrl) {
    try {
      const qrCode = await QRCode.toDataURL(otpauth_url);
      return qrCode;
    } catch (error) {
      strapi.log.error('Erro ao gerar QR Code:', error);
      throw error;
    }
  },

  /**
   * Verifica um token 2FA
   */
  verifyToken(secret, token) {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Permite uma janela de 2 períodos para compensar diferenças de relógio
    });
  },

  /**
   * Habilita 2FA para um usuário
   */
  async enable2FA(userId, secret) {
    try {
      await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: {
          twoFactorSecret: secret,
          twoFactorEnabled: true,
        },
      });

      strapi.log.info(`2FA habilitado para usuário #${userId}`);
      return true;
    } catch (error) {
      strapi.log.error('Erro ao habilitar 2FA:', error);
      throw error;
    }
  },

  /**
   * Desabilita 2FA para um usuário
   */
  async disable2FA(userId) {
    try {
      await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: {
          twoFactorSecret: null,
          twoFactorEnabled: false,
        },
      });

      strapi.log.info(`2FA desabilitado para usuário #${userId}`);
      return true;
    } catch (error) {
      strapi.log.error('Erro ao desabilitar 2FA:', error);
      throw error;
    }
  },
};
