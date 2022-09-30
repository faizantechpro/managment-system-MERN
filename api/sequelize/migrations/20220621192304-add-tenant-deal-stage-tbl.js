/**
 * Warning, this is a table snapshot in its original implementation. For new
 * environments, this migration should not be ran as table already exists.
 *
 * Thus, never update this migration, rely on defined model for up to date
 * representation.
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "tenant_deal_stage" ("id" UUID , "active" BOOLEAN DEFAULT true, "position" INTEGER, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "deal_stage_id" UUID REFERENCES "deal_stage" ("id") ON DELETE SET NULL ON UPDATE CASCADE, "tenant_id" UUID REFERENCES "tenants" ("id") ON DELETE SET NULL ON UPDATE CASCADE, PRIMARY KEY ("id")); 
    `);
  },

  async down(queryInterface, Sequelize) {},
};
