'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'products';
const column = 'description';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.STRING(256),
  allowNull: true,
});
