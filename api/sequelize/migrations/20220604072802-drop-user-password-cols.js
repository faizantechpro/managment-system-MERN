'use strict';

const Migration = require('../Migration');

const table = 'users';

module.exports = {
  async up(queryInterface, Sequelize) {
    let hasColumn = await Migration.hasColumn(
      queryInterface,
      table,
      'password'
    );
    if (hasColumn) {
      await queryInterface.removeColumn(table, 'password', {});
    }
    hasColumn = await Migration.hasColumn(queryInterface, table, 'tfa_secret');
    if (hasColumn) {
      await queryInterface.removeColumn(table, 'tfa_secret', {});
    }
    hasColumn = await Migration.hasColumn(queryInterface, table, 'token');
    if (hasColumn) {
      await queryInterface.removeColumn(table, 'token', {});
    }

    return;
  },

  async down(queryInterface, Sequelize) {},
};
