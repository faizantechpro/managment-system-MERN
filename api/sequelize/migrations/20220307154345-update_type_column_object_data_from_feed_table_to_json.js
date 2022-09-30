'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'feed', // name of Source model
        'object_data', // name of the key we're adding
        // attributes of the new column
        {
          type: 'JSON USING CAST("object_data" as JSON)',
        }
      ),
    ]);
  },
};
