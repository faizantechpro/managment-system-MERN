'use strict';

const Migration = require('../Migration');

module.exports = {
  async up(queryInterface, Sequelize) {
    let hasColumn = await Migration.hasColumn(
      queryInterface,
      'users',
      'password'
    );
    if (!hasColumn) {
      console.warn('password column already migrated');
      return;
    }

    const [users] = await queryInterface.sequelize.query(`
      select u.id, u.password, u.tfa_secret
      from users u;    
    `);

    await Promise.all(
      users.map(async (user) => {
        const password = user.password ? `'${user.password}'` : 'NULL';
        const tfaSecret = user.tfa_secret ? `'${user.tfa_secret}'` : 'NULL';

        await queryInterface.sequelize.query(`
          insert into user_credential
          (user_id, password, tfa_secret)
          values
          ('${user.id}', ${password}, ${tfaSecret})
      `);
      })
    );
  },

  async down(queryInterface, Sequelize) {},
};
