'use strict';

const { Op } = require('sequelize');
const uuid = require('uuid').v4;

const TABLE = 'rpmg_summary';
const VERTICAL_TABLE = 'rpmg_vertical';

const seed = {
  Agriculture: [
    {
      id: uuid(),
      average_p_card_spending: 3433819,
      average_p_card_transactions: 6719,
      average_spending_per_transaction: 463,
      average_spending_per_mm_revenue: 28495,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  'Ancillary agri-business services': [
    {
      id: uuid(),
      average_p_card_spending: 1499644,
      average_p_card_transactions: 2988,
      average_spending_per_transaction: 460,
      average_spending_per_mm_revenue: 56167,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  Construction: [
    {
      id: uuid(),
      average_p_card_spending: 2093917,
      average_p_card_transactions: 3344,
      average_spending_per_transaction: 598,
      average_spending_per_mm_revenue: 57883,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  Education: [
    {
      id: uuid(),
      average_p_card_spending: 1204287,
      average_p_card_transactions: 3655,
      average_spending_per_transaction: 324,
      average_spending_per_mm_revenue: 43533,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  'Finance and insurance': [
    {
      id: uuid(),
      average_p_card_spending: 2852400,
      average_p_card_transactions: 5655,
      average_spending_per_transaction: 438,
      average_spending_per_mm_revenue: 25730,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  'Freight and transport': [
    {
      id: uuid(),
      average_p_card_spending: 2927113,
      average_p_card_transactions: 4414,
      average_spending_per_transaction: 690,
      average_spending_per_mm_revenue: 36413,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  Government: [
    {
      id: uuid(),
      average_p_card_spending: 1089969,
      average_p_card_transactions: 2797,
      average_spending_per_transaction: 386,
      average_spending_per_mm_revenue: 29485,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  Healthcare: [
    {
      id: uuid(),
      average_p_card_spending: 2746743,
      average_p_card_transactions: 3798,
      average_spending_per_transaction: 761,
      average_spending_per_mm_revenue: 38744,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  Manufacturing: [
    {
      id: uuid(),
      average_p_card_spending: 2094543,
      average_p_card_transactions: 3602,
      average_spending_per_transaction: 572,
      average_spending_per_mm_revenue: 38284,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  'Non-profit': [
    {
      id: uuid(),
      average_p_card_spending: 1507667,
      average_p_card_transactions: 2217,
      average_spending_per_transaction: 585,
      average_spending_per_mm_revenue: 39244,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  'Senior care and housing': [
    {
      id: uuid(),
      average_p_card_spending: 1080849,
      average_p_card_transactions: 1998,
      average_spending_per_transaction: 501,
      average_spending_per_mm_revenue: 52199,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  Software: [
    {
      id: uuid(),
      average_p_card_spending: 2032939,
      average_p_card_transactions: 3363,
      average_spending_per_transaction: 569,
      average_spending_per_mm_revenue: 24452,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  Tourism: [
    {
      id: uuid(),
      average_p_card_spending: 1339020,
      average_p_card_transactions: 2103,
      average_spending_per_transaction: 639,
      average_spending_per_mm_revenue: 46468,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  Utilities: [
    {
      id: uuid(),
      average_p_card_spending: 1802160,
      average_p_card_transactions: 4314,
      average_spending_per_transaction: 396,
      average_spending_per_mm_revenue: 22719,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  Wholesalers: [
    {
      id: uuid(),
      average_p_card_spending: 1245380,
      average_p_card_transactions: 1947,
      average_spending_per_transaction: 555,
      average_spending_per_mm_revenue: 53132,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  'Blended rate': [
    {
      id: uuid(),
      average_p_card_spending: 2188330,
      average_p_card_transactions: 3557,
      average_spending_per_transaction: 587,
      average_spending_per_mm_revenue: 43431,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  'All Organizations': [
    {
      id: uuid(),
      average_p_card_spending: 2328696,
      average_p_card_transactions: 4367,
      average_spending_per_transaction: 517,
      average_spending_per_mm_revenue: 43353,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
};

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      return Promise.all(
        Object.entries(seed).map(async ([industry, naics]) => {
          const industryEntryId = await queryInterface.rawSelect(
            VERTICAL_TABLE,
            {
              where: {
                industry,
              },
            },
            ['id']
          );

          const entries = naics.map((naic) => ({
            ...naic,
            rpmg_vertical_id: industryEntryId,
          }));

          return queryInterface.bulkInsert(TABLE, entries, {});
        })
      );
    } catch (error) {
      console.error(error);
    }
  },

  async down(queryInterface, Sequelize) {},
};
