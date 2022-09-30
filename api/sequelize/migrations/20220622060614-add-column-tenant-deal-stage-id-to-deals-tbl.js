'use strict';

const { Sequelize } = require('sequelize');
const Migration = require('../Migration');

const table = 'deals';
const column = 'tenant_deal_stage_id';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.UUID,
  allowNull: true,
});
