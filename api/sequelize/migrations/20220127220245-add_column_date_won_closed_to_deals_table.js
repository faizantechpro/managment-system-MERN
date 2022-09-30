'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'deals';
const column = 'date_won_closed';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.DATE,
  allowNull: true,
});
