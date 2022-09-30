'use strict';

const Migration = require('../Migration');

const table = 'dashboardComponent';
const column = 'type';

module.exports = {
  async up(queryInterface, Sequelize) {
    const hasColumn = await Migration.hasColumn(queryInterface, table, column);
    if (hasColumn) {
      return queryInterface.removeColumn(table, column);
    }
  },

  async down(queryInterface, Sequelize) {},
};
