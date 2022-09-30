'use strict';

const Migration = require('../Migration');

const table = 'deals';
const column = 'tenant_deal_stage_id';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (
      !(await Migration.hasConstraint(
        queryInterface,
        table,
        'deals_tenant_deal_stage_id_tenant_deal_stage_fk'
      ))
    ) {
      await queryInterface.addConstraint(table, {
        fields: [column],
        type: 'foreign key',
        references: {
          table: 'tenant_deal_stage',
          field: 'id',
        },
        onUpdate: 'cascade',
      });
    }

    return;
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn(table, column)]);
  },
};
