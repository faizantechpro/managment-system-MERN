'use strict';

const { Op } = require('sequelize');
const uuid = require('uuid').v4;

const TABLE = 'rpmg_vertical';

const seed = [
  {
    id: '8e427c07-620e-499d-900b-c3f37f78c397',
    industry: 'Agriculture',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '1236642a-0fe7-42bd-b714-c2ee58c63288',
    industry: 'Ancillary agri-business services',
    description: 'e.g., farm equipment suppliers and grain and seed merchants',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'a6ebf4ee-86c8-4ca2-b316-aa5983b0894d',
    industry: 'Construction',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'ee8cf2b4-c54b-471f-affd-5b7fcbfcdb85',
    industry: 'Education',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '4bc8178b-db64-460e-934e-75f6f710af57',
    industry: 'Finance and insurance',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'a7bd3a5d-3ae3-485b-8e82-5bb26e91ab30',
    industry: 'Freight and transport',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '7874a799-914b-4be5-aa6e-97dcfe572e53',
    industry: 'Government',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '77f7131f-1ca1-4099-8a16-8df64437f95a',
    industry: 'Healthcare',
    description: 'e.g., hospitals, physicians, care facilities and dentists',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '4d375e09-a9f0-4d16-bf9c-7694da6208ea',
    industry: 'Manufacturing',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '6813a448-7d94-4f48-b259-1ebb9ba49666',
    industry: 'Non-profit',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'e0da9be7-1496-4118-9030-9f35c73f7b8e',
    industry: 'Senior care and housing',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '0b68fe0c-a8e1-4ef3-a955-378f0d9d097f',
    industry: 'Software',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '69633c6c-82ae-49ec-a38b-50f62a7e5a82',
    industry: 'Tourism',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '708643f1-5f11-47d1-bb86-757b236e355e',
    industry: 'Utilities',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'ff22f961-9b5f-45fd-ada8-18790594b21b',
    industry: 'Wholesalers',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '1a7eed4c-113b-42a3-b769-36626dac845c',
    industry: 'Blended rate',
    description: 'All clients who do not fall under these industries',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2b03ae0a-9266-4fb2-adee-18a0be603692',
    industry: 'All Organizations',
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
      [Op.or]: seed.map(({ industry }) => ({
        industry,
      })),
    });
  },
};
