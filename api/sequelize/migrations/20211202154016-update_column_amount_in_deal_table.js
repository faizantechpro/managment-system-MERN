'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // TODO remove this empty resolve. Had to correct file name due to \n
    return Promise.resolve();
    // return Promise.all([
    //   queryInterface.changeColumn(
    //     'deals', // name of Source model
    //     'amount', // name of the key we're adding
    //     // attributes of the new column
    //     {
    //       type: Sequelize.DataTypes.FLOAT(10, 2),
    //     }
    //   ),
    // ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'deals', // name of Source model
        'amount', // name of the key we're adding
        // attributes of the new column
        {
          type: Sequelize.DataTypes.INTEGER(),
        }
      ),
    ]);
  },
};
