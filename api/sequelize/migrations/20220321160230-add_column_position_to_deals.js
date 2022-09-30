'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'deals';
const column = 'position';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 0,
});
