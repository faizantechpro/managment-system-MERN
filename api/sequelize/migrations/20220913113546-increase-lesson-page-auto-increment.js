'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    //Migration to alter auto increment valu of id, as data mixup from prod given unique id error need to.
    return queryInterface.sequelize.query(`
    ALTER SEQUENCE lesson_pages_id_seq RESTART WITH 1000;
    `);
  },

  async down (queryInterface, Sequelize) {

  }
};
