'use strict';

const educationVerticalId = 'ee8cf2b4-c54b-471f-affd-5b7fcbfcdb85';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      update rpmg_summary rs
      set average_p_card_transactions = 3655, average_spending_per_transaction = 324
      where rs.rpmg_vertical_id = '${educationVerticalId}';
    `);
  },

  async down(queryInterface, Sequelize) {},
};
