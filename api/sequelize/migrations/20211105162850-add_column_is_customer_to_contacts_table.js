'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'contacts';
const column = 'is_customer';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.BOOLEAN,
});
