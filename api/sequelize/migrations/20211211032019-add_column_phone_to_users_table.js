'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'users';
const column = 'phone';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.STRING,
  allowNull: true,
});
