'use strict';

const table = 'courses';

const defaultPublicCourses = [
  'Understanding Card Payments',
  'Treasury Management Sales Strategy',
  'Faster Payments 101',
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const [courses] = await queryInterface.sequelize.query(`
      SELECT c.id, c.name
      FROM ${table} c
      WHERE c.name IN (
        ${defaultPublicCourses.map((course) => `'${course}'`).join(',')}
      );
    `);

    await Promise.all(
      courses.map(async (course) => {
        await queryInterface.sequelize.query(`
          UPDATE ${table}
          SET "isPublic" = true
          WHERE id = '${course.id}';
        `);
      })
    );
  },

  async down(queryInterface, Sequelize) {},
};
