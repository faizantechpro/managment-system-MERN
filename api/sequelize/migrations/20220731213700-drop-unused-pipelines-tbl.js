'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      return queryInterface.dropTable('pipelines');
    } catch (error) {}
  },

  async down(queryInterface, Sequelize) {},
};
