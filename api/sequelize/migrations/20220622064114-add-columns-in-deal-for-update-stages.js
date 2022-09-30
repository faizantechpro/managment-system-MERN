'use strict';

const { Sequelize } = require('sequelize');
const Migration = require('../Migration');

const table = 'deals';

module.exports = Migration.addColumn(table, 'status', {
  type: Sequelize.DataTypes.ENUM('won', 'lost'),
  allowNull: true,
});
