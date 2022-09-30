'use strict';

const Migration = require('../Migration');

const table = 'component';
const column = 'type';

module.exports = {
  async up(queryInterface, Sequelize) {
    const hasColumn = await Migration.hasColumn(queryInterface, table, column);
    if (hasColumn) {
      await queryInterface.removeColumn(table, column);
      await queryInterface.sequelize.query(`
        DROP TYPE "enum_component_type";
      `);
    }
  },

  async down(queryInterface, Sequelize) {},
};
