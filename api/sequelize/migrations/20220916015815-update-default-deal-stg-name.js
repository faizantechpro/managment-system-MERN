'use strict';

const previousStages =
  "('Qualified', 'Meeting', 'Proposal', 'Custom', 'Negotiations')";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE deal_stage SET name = CASE name
        WHEN 'Custom' THEN 'Contact Made'
        WHEN 'Meeting' THEN 'Meeting Scheduled'
        WHEN 'Proposal' THEN 'Proposal Made'
        WHEN 'Negotiations' THEN 'Negotiations Started'
        ELSE name END
      WHERE name IN${previousStages} AND is_default = true;
    `);
  },

  async down(queryInterface, Sequelize) {},
};
