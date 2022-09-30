'use strict';

const table = 'activities';
const column = 'contact_id';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(table, column);
  },

  async down(queryInterface, Sequelize) {},
};
