'use strict';

const { Op } = require('sequelize');
const uuid = require('uuid').v4;

const TABLE = 'naics_rpmg';
const VERTICAL_TABLE = 'rpmg_vertical';

const seed = {
  Agriculture: [{ created_at: new Date(), updated_at: new Date(), code: '11' }],
  'Ancillary agri-business services': [
    { created_at: new Date(), updated_at: new Date(), code: '33' },
    { created_at: new Date(), updated_at: new Date(), code: '42' },
  ],
  Construction: [
    { created_at: new Date(), updated_at: new Date(), code: '23' },
  ],
  Education: [{ created_at: new Date(), updated_at: new Date(), code: '61' }],
  'Finance and insurance': [
    { created_at: new Date(), updated_at: new Date(), code: '52' },
  ],
  'Freight and transport': [
    { created_at: new Date(), updated_at: new Date(), code: '48' },
    { created_at: new Date(), updated_at: new Date(), code: '49' },
  ],
  Government: [{ created_at: new Date(), updated_at: new Date(), code: '92' }],
  Healthcare: [{ created_at: new Date(), updated_at: new Date(), code: '62' }],
  Manufacturing: [
    { created_at: new Date(), updated_at: new Date(), code: '31' },
    { created_at: new Date(), updated_at: new Date(), code: '32' },
    { created_at: new Date(), updated_at: new Date(), code: '33' },
  ],
  // 'Non-profit': [
  //   { created_at: new Date(), updated_at: new Date(), code: '' },
  // ],
  'Senior care and housing': [
    { created_at: new Date(), updated_at: new Date(), code: '62' },
  ],
  Software: [
    { created_at: new Date(), updated_at: new Date(), code: '51' },
    { created_at: new Date(), updated_at: new Date(), code: '54' },
  ],
  Tourism: [{ created_at: new Date(), updated_at: new Date(), code: '71' }],
  Utilities: [{ created_at: new Date(), updated_at: new Date(), code: '22' }],
  Wholesalers: [{ created_at: new Date(), updated_at: new Date(), code: '42' }],
  'Blended rate': [
    { created_at: new Date(), updated_at: new Date(), code: '81' },
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

  async down(queryInterface, Sequelize) {
    const allCodes = [].concat(...Object.values(seed));

    return queryInterface.bulkDelete(TABLE, {
      [Op.or]: allCodes.map(({ code }) => ({
        code,
      })),
    });
  },
};
