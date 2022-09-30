'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'tenant_deal_stage';
const column = 'probability';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.FLOAT,
});
