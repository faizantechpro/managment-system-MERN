'use strict';

const { v4 } = require('uuid');

const defaultStages =
  "('Qualified', 'Meeting', 'Proposal', 'Custom', 'Negotiations')";

module.exports = {
  async up(queryInterface, Sequelize) {
    const [tenants] = await queryInterface.sequelize.query(`
      select t.id from tenants t;
    `);

    const [stages] = await queryInterface.sequelize.query(`
      select s.id from deal_stage s where name in ${defaultStages}
    `);

    const bulkInserts = [];
    tenants.forEach((tenant) => {
      const t = tenant.id;
      stages.forEach((stage, index) => {
        bulkInserts.push({
          id: v4(),
          deal_stage_id: stage.id,
          position: index,
          tenant_id: t,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    });

    if (bulkInserts.length === 0) {
      console.warn(`nothing to migrate due to length 0: ${bulkInserts}`);
      return;
    }

    await queryInterface.bulkInsert('tenant_deal_stage', bulkInserts, {});
  },

  async down(queryInterface, Sequelize) {},
};
