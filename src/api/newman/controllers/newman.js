'use strict';

/**
 * newman controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::newman.newman');
