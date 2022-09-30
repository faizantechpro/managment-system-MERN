'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'organizations', // name of Source model
        'industry', // name of the key we're adding
        // attributes of the new column
        {
          type: Sequelize.DataTypes.STRING(150),
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
