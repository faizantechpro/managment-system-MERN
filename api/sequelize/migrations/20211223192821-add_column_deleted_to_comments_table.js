'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'comments';
const column = 'deleted';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.BOOLEAN,
  defaultValue: false,
});
