'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'deal_products', // name of Source model
        'price', // name of the key we're adding
        // attributes of the new column
        {
          type: Sequelize.DataTypes.FLOAT(10, 2),
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'deal_products', // name of Source model
        'price', // name of the key we're adding
        // attributes of the new column
        {
          type: Sequelize.DataTypes.INTEGER(),
        }
      ),
    ]);
  },
};
