'use strict';
const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'contact_field';
const column = 'tenant_id';
const defaultTenantId = 'cacadeee-0000-4000-a000-000000000000';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.UUID,
  allowNull: true,
  default: defaultTenantId,
});
