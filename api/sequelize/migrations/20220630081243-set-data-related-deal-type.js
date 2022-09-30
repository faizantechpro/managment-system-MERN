'use strict';

const table = 'deals';

const dealTypes = ['cold', 'warm', 'hot'];

module.exports = {
  async up(queryInterface, Sequelize) {
    const [tenants] = await queryInterface.sequelize.query(
      `select t.id from tenants t`
    );

    await Promise.all(
      tenants.map(async (tenant) => {
        const tenantId = tenant.id;
        const [stages] = await queryInterface.sequelize.query(
          `select s.id, s.tenant_id from tenant_deal_stage s where tenant_id = '${tenantId}' and position < 3 and deal_stage_id IS NOT NULL;`
        );
        await Promise.all(
          stages.map(async (stage, idx) => {
            const deal_type = dealTypes[idx];
            await queryInterface.sequelize.query(
              `update ${table} set tenant_deal_stage_id = '${stage.id}' where deal_type='${deal_type}' and tenant_id='${stage.tenant_id}'`
            );
          })
        );
      })
    );
  },

  async down(queryInterface, Sequelize) {},
};
