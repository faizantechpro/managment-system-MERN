'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'files';
const column = 'is_public';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.BOOLEAN,
  default: false,
});
