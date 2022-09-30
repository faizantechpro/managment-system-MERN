'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('roles', 'tenant_id', {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    });
  },
};
