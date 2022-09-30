'use strict';

const Sequelize = require('sequelize');
const Migration = require('../Migration');

const table = 'contacts';
const column = 'cif';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.STRING(50),
});
