'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('organizations', 'parent_id', {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('organizations', 'parent_id'),
    ]);
  },
};
