'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      return queryInterface.dropTable('reports_dashboard');
    } catch (error) {}
  },

  async down(queryInterface, Sequelize) {},
};
