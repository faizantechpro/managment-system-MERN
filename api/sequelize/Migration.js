class Migration {
  async hasColumn(queryInterface, table, column) {
    const definition = await queryInterface.describeTable(table);

    return !!definition[column];
  }

  async hasConstraint(queryInterface, table, constraint) {
    const indexes = await queryInterface.getForeignKeyReferencesForTable(table);

    return indexes.some(({ constraintName }) => constraintName === constraint);
  }

  async addColumn(table, column, attrs, opts) {
    return {
      up: async (queryInterface, Sequelize) => {
        const hasColumn = await this.hasColumn(queryInterface, table, column);
        if (hasColumn) {
          console.warn(
            `table ${table} already contains column ${column}, skipping add`
          );
          return true;
        }

        return queryInterface.sequelize.transaction((t) => {
          return queryInterface.addColumn(table, column, attrs, {
            ...opts,
            transaction: t,
          });
        });
      },

      down: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
          return queryInterface.removeColumn(table, column, {
            ...opts,
            transaction: t,
          });
        });
      },
    };
  }

  async createTable(table, attrs, opts) {
    return {
      up: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
          return queryInterface.createTable(table, attrs, {
            ...opts,
            transaction: t,
          });
        });
      },

      down: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
          return queryInterface.dropTable(table, {
            ...opts,
            transaction: t,
          });
        });
      },
    };
  }

  removeConstraint(table, constraint, attrs, opts) {
    return {
      up: async (queryInterface, Sequelize) => {
        const hasConstraint = await this.hasConstraint(
          queryInterface,
          table,
          constraint
        );
        if (!hasConstraint) {
          console.warn(
            `table ${table} does not have constraint ${constraint}, skipping remove`
          );
          return true;
        }

        return queryInterface.removeConstraint(table, constraint);
      },

      down: async (queryInterface, Sequelize) => {
        // TODO revisit this
        return queryInterface.addConstraint(table, constraint);
      },
    };
  }
}

module.exports = new Migration();
