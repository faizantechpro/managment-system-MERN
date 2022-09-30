'use strict';

const table = 'tenants';
const column = 'modules';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(table, column, {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {},
};
