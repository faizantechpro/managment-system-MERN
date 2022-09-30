'use strict';

const Migration = require('../Migration');

const table = 'organizations';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const promises = [];

    if (!(await Migration.hasColumn(queryInterface, table, 'branch'))) {
      promises.push(
        queryInterface.addColumn(table, 'branch', {
          type: Sequelize.DataTypes.STRING(10),
          allowNull: true,
        })
      );
    }
    if (!(await Migration.hasColumn(queryInterface, table, 'total_revenue'))) {
      promises.push(
        queryInterface.addColumn(table, 'total_revenue', {
          type: Sequelize.DataTypes.STRING(100),
          allowNull: true,
        })
      );
    }

    return Promise.all(promises);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(table, 'branch'),
      queryInterface.removeColumn(table, 'total_revenue'),
    ]);
  },
};
