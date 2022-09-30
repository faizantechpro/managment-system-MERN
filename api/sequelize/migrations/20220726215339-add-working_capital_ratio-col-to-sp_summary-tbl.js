'use strict';

const { Sequelize } = require('sequelize');
const Migration = require('../Migration');

const table = 'sp_summary';
const column = 'working_capital_ratio';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.FLOAT,
});
