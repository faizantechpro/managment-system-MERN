'use strict';

const { Sequelize } = require('sequelize');
const Migration = require('../Migration');

const table = 'sp_summary';
const column = 'report_date';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.DATE,
  allowNull: false,
  defaultValue: Sequelize.fn('NOW'),
});
