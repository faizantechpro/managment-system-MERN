'use strict';

const { v4 } = require('uuid');

const stages = [
  {
    id: v4(),
    name: 'Qualified',
    is_default: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: v4(),
    name: 'Meeting Scheduled',
    is_default: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: v4(),
    name: 'Proposal Made',
    is_default: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: v4(),
    name: 'Custom Made',
    is_default: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: v4(),
    is_default: true,
    name: 'Negotiations Started',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('deal_stage', stages, {});
  },

  async down(queryInterface, Sequelize) {},
};
