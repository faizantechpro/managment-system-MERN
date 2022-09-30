'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'roles';
const column = 'owner_access';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.BOOLEAN,
  defaultValue: false,
  allowNull: false,
});
