'use strict';

const { Sequelize } = require('sequelize');
const Migration = require('../Migration');

const table = 'course_progress';
const column = 'is_favorite';

module.exports = Migration.addColumn(table, column, {
  type: Sequelize.DataTypes.BOOLEAN,
  defaultValue: false,
});
