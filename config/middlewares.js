module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // Rate limiting middleware para proteção contra brute force
  {
    name: 'global::rate-limit',
    config: {},
  },
  // Helmet middleware para headers de segurança
  // Configurado para permitir recursos cross-origin em desenvolvimento
  {
    name: 'global::helmet',
    config: {},
  },
];
