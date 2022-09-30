'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'organizations';
const column = 'cif';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.STRING(50),
});
