'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      return queryInterface.dropTable('insights_modules');
    } catch (error) {}
  },

  async down(queryInterface, Sequelize) {},
};
