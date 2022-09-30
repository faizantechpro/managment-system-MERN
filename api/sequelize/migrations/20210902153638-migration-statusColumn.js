'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'lessons';
const column = 'status';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.STRING,
});
