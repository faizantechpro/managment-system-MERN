'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      return queryInterface.dropTable('insights_reports');
    } catch (error) {}
  },

  async down(queryInterface, Sequelize) {},
};
