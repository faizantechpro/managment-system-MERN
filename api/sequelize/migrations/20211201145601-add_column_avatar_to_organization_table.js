'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'organizations';
const column = 'avatar';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.STRING(255),
  allowNull: true,
});
