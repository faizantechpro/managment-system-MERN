'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'lessons';
const column = 'icon';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.STRING,
});
