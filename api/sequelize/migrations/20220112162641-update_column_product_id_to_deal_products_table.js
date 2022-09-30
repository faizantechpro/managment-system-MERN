'use strict';

const Migration = require('../Migration');

const table = 'deal_products';
const constraint = 'deal_products_product_id_deal_id_key';

module.exports = Migration.removeConstraint(table, constraint);
