'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'comments';
const column = 'comment';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.JSON,
  allowNull: true,
});
