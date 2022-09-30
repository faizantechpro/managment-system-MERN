'use strict';

const { Sequelize } = require('sequelize');
const Migration = require('../Migration');

const table = 'activities';
const column = 'deleted_on';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.DATE,
  allowNull: true,
});
