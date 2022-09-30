'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'tenants';
const column = 'colors';
const defaultColor = {
  name: 'main',
  primaryColor: '#111B51',
  secondaryColor: '#092ACE',
};

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.JSON,
  allowNull: true,
  default: defaultColor,
});
