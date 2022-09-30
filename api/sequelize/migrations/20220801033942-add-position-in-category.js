'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'categories';
const column = 'position';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.INTEGER,
  autoIncrement: true,
});
