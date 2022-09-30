'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('organizations', 'employees', {
        transaction: t,
      });

      await queryInterface.addColumn(
        'organizations',
        'employees',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        { transaction: t }
      );

      return;
    });
  },
};
