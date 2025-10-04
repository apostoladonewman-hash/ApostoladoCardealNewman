'use strict';

/**
 * newman router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::newman.newman');
