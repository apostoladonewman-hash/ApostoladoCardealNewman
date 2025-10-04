'use strict';

/**
 * newman service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::newman.newman');
