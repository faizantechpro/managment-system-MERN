'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      update courses c
      set "status"='draft'
      where "status"='unpublished';
    `);
  },

  async down(queryInterface, Sequelize) {},
};
