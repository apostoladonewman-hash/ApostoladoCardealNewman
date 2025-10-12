'use strict';

/**
 * moderation-log router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::moderation-log.moderation-log');

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;

  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: 'GET',
    path: '/moderation-logs/by-moderator/:moderatorId',
    handler: 'moderation-log.findByModerator',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'GET',
    path: '/moderation-logs/by-content/:contentType/:contentId',
    handler: 'moderation-log.findByContent',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'GET',
    path: '/moderation-logs/stats',
    handler: 'moderation-log.stats',
    config: {
      policies: [],
      middlewares: [],
    },
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
