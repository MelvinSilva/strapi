'use strict';

/**
 * tirage service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tirage.tirage');
