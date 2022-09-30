'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'note';
const column = 'note';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.JSON,
  allowNull: true,
});
