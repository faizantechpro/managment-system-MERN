'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'insights_modules';

module.exports = Migration.createTable(table, {
  id: {
    primaryKey: true,
    type: Sequelize.DataTypes.UUID,
  },
  title: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});
