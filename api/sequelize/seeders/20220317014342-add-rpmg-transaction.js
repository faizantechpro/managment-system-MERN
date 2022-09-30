'use strict';

const { Op } = require('sequelize');
const uuid = require('uuid').v4;

const TABLE = 'rpmg_transaction';

const seed = [
  {
    id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    name: 'Percentage of Transactions $2,500 or Less Paid by...',
    range: '<2500',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    name: 'Percentage of Transactions $2,501 to $10,000 Paid by...',
    range: '2501-10000',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    name: 'Percentage of Transactions $10,001 to $100,000 Paid by...',
    range: '10001-100000',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    name: 'Percentage of Transactions Above $100,001 Paid by...',
    range: '>100001',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      return queryInterface.bulkInsert(TABLE, seed, {});
    } catch (error) {
      console.error(error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(TABLE, {
      [Op.or]: seed.map(({ name, range }) => ({
        name,
        range,
      })),
    });
  },
};
