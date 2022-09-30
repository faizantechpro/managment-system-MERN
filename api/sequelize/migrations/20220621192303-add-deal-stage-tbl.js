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
       CREATE TABLE IF NOT EXISTS "deal_stage" ("id" UUID , "name" VARCHAR(50) NOT NULL UNIQUE, "description" TEXT, "is_default" BOOLEAN DEFAULT false, "deleted_on" TIMESTAMP WITH TIME ZONE DEFAULT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
     `);
  },

  async down(queryInterface, Sequelize) {},
};
