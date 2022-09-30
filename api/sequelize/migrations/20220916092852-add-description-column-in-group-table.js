'use strict';

const { Sequelize } = require('sequelize');
const Migration = require('../Migration');

const table = 'groups';
const column = 'description';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.TEXT,
  allowNull: true,
});
