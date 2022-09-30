'use strict';

const defaultTenantId = 'cacadeee-0000-4000-a000-000000000000';
const newColumn = 'tenant_id';
const tables = [
  'roles',
  'users',
  'organizations',
  'contacts',
  'deals',
  'comments',
  'note',
  'feed',
  'activities',
  'files',
  'activity_file',
  'products',
  'badges',
  'categories',
  'courses',
  'course_progress',
  'field',
  'groups',
  'lessons',
  'lesson_trackings',
  'lesson_pages',
  'labels',
  'notification_settings',
  'organization_field',
  'organization_guest',
  'permissions',
  'questions',
  'quiz_submission',
  'quizzes',
  'report',
  'sessions',
];

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all(
        tables.map((table) => {
          return queryInterface.changeColumn(
            table,
            newColumn,
            {
              type: Sequelize.DataTypes.UUID,
              allowNull: false,
              default: defaultTenantId,
            },
            { transaction: t }
          );
        })
      );
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all(
        tables.map((table) =>
          queryInterface.removeColumn(table, newColumn, { transaction: t })
        )
      );
    });
  },
};
