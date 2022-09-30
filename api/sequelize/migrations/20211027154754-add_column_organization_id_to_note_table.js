'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'note';
const column = 'organization_id';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.UUID,
  allowNull: true,
});
