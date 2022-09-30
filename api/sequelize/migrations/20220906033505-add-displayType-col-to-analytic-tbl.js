'use strict';

const column = 'displayType';
const table = 'analytic';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn(table, column, {
        type: Sequelize.ENUM(
          'kpi_standard',
          'kpi_scorecard',
          'kpi_growth_index',
          'kpi_rankings',
          'kpi_basic',
          'chart_column',
          'chart_donut',
          'chart_pie',
          'chart_bar',
          'chart_line',
          'chart_table',
          'chart_funnel',
          'chart_area',
          'chart_heat'
        ),
        allowNull: true,
      });
    } catch (error) {}

    await queryInterface.sequelize.query(`
      update ${table}
      set "${column}" = 'kpi_standard'
    `);

    // need to drop enum...
    await queryInterface.changeColumn(table, column, {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_analytic_displayType";
    `);

    await queryInterface.changeColumn(table, column, {
      type: Sequelize.ENUM(
        'kpi_standard',
        'kpi_scorecard',
        'kpi_growth_index',
        'kpi_rankings',
        'kpi_basic',
        'chart_column',
        'chart_donut',
        'chart_pie',
        'chart_bar',
        'chart_line',
        'chart_table',
        'chart_funnel',
        'chart_area',
        'chart_heat'
      ),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {},
};
