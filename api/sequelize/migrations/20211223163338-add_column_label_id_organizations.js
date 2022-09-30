'use strict';

const Migration = require('../Migration');

const table = 'organizations';
const column = 'label_id';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const promises = [];

    if (!(await Migration.hasColumn(queryInterface, table, column))) {
      promises.push(
        queryInterface.addColumn(table, column, {
          type: Sequelize.DataTypes.UUID,
          allowNull: true,
        })
      );
    }

    if (
      !(await Migration.hasConstraint(
        queryInterface,
        table,
        'organizations_label_id_labels_fk'
      ))
    ) {
      promises.push(
        queryInterface.addConstraint(table, {
          fields: [column],
          type: 'foreign key',
          references: {
            table: 'labels',
            field: 'id',
          },
          onUpdate: 'cascade',
        })
      );
    }

    return Promise.all(promises);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn(table, column)]);
  },
};
