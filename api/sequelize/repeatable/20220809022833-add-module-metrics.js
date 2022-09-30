'use strict';

const v4 = require('uuid').v4;

const table = 'analytic';

const seeds = [
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Bottom 5 Users by Lessons Completed',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify(['User']),
    displayType: 'kpi_rankings',
    icon: 'class',
    isMulti: false,
    dimensions: JSON.stringify(['User.firstName', 'User.lastName']),
    filters: JSON.stringify([]),
    limit: 5,
    measures: JSON.stringify(['LessonProgress.countOfCompleted']),
    order: JSON.stringify([['LessonProgress.countOfCompleted', 'asc']]),
    segments: JSON.stringify([]),
  },

  /**
   * Overview
   */
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Contacts Created - This Month',
    type: 'Contact',
    relatedTypes: JSON.stringify([]),
    displayType: 'kpi_standard',
    icon: '',
    isMulti: true,
    filters: JSON.stringify([]),
    measures: JSON.stringify(['Contact.count']),
    order: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        compareDateRange: ['this month', 'last month'],
        dimension: 'Contact.dateEntered',
      },
    ]),
  },

  // name: 'Deals Lost - This Month',

  // {
  //   id: v4(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   name: 'Activities Completed - This Month',
  //   relatedTypes: JSON.stringify([]),
  //   displayType: 'kpi_standard',
  //   icon: '',
  //   isMulti: true,
  // },

  //   name: 'Open Deals by Stage - This Month',

  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Revenue Won By Month',
    type: 'Deal',
    relatedTypes: JSON.stringify([]),
    displayType: 'chart_column',
    icon: 'monetization_on',
    dimensions: JSON.stringify([]),
    filters: JSON.stringify([]),
    limit: 10000,
    measures: JSON.stringify(['Deal.sumOfRevenue']),
    order: JSON.stringify([['Deal.dateEntered', 'desc']]),
    timeDimensions: JSON.stringify([
      {
        dimension: 'Deal.dateEntered',
        granularity: 'month',
        dateRange: 'from 6 month ago to now',
      },
    ]),
  },
  // {
  //   id: v4(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   name: 'Tasks Closed - This Month',
  //   type: 'TASK',
  //   relatedTypes: JSON.stringify([]),
  //   displayType: 'kpi_standard',
  //   icon: '',
  //   isMulti: false,
  // },
  // {
  //   id: v4(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   name: 'Top 5 Organizations',
  //   type: 'Organization',
  //   relatedTypes: JSON.stringify([]),
  //   displayType: 'kpi_rankings',
  //   icon: '',
  //   isMulti: false,
  // },

  // name: 'Deals Won - This Month',

  /**
   * Deal
   */

  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Open Deals - This Month',
    type: 'Deal',
    relatedTypes: JSON.stringify([]),
    displayType: 'kpi_standard',
    icon: 'monetization_on',
    isMulti: true,
    dimensions: JSON.stringify([]),
    filters: JSON.stringify([]),
    limit: 10000,
    measures: JSON.stringify(['Deal.count']),
    order: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        compareDateRange: ['this month', 'last month'],
        dimension: 'Deal.dateEntered',
      },
    ]),
  },
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Deals Won - This Month',
    type: 'Deal',
    relatedTypes: JSON.stringify([]),
    displayType: 'kpi_standard',
    icon: 'monetization_on',
    dimensions: JSON.stringify([]),
    filters: JSON.stringify([]),
    limit: 10000,
    measures: JSON.stringify(['Deal.countOfWon']),
    order: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        compareDateRange: ['this month', 'last month'],
        dimension: 'Deal.dateModified',
      },
    ]),
  },
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Deals Lost - This Month',
    type: 'Deal',
    relatedTypes: JSON.stringify([]),
    displayType: 'kpi_standard',
    icon: 'monetization_on',
    dimensions: JSON.stringify([]),
    filters: JSON.stringify([]),
    limit: 10000,
    measures: JSON.stringify(['Deal.countOfLost']),
    order: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        compareDateRange: ['this month', 'last month'],
        dimension: 'Deal.dateModified',
      },
    ]),
  },
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Revenue Won - This Month',
    type: 'Deal',
    relatedTypes: JSON.stringify([]),
    displayType: 'kpi_standard',
    icon: 'monetization_on',
    dimensions: JSON.stringify([]),
    filters: JSON.stringify([]),
    limit: 10000,
    measures: JSON.stringify(['Deal.sumOfRevenue']),
    order: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        compareDateRange: ['this month', 'last month'],
        dimension: 'Deal.dateEntered',
      },
    ]),
  },
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Monthly Revenue By User',
    type: 'Deal',
    relatedTypes: JSON.stringify(['User']),
    displayType: 'chart_column',
    icon: 'monetization_on',
    dimensions: JSON.stringify(['User.firstName', 'User.lastName']),
    filters: JSON.stringify([]),
    limit: 10000,
    measures: JSON.stringify(['Deal.sumOfRevenue']),
    order: JSON.stringify([['Deal.dateEntered', 'desc']]),
    timeDimensions: JSON.stringify([
      {
        dimension: 'Deal.dateEntered',
        granularity: 'month',
        dateRange: 'from 6 month ago to now',
      },
    ]),
  },
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 5 Users - Deals Won',
    type: 'Deal',
    relatedTypes: JSON.stringify(['User']),
    displayType: 'kpi_rankings',
    icon: 'monetization_on',
    isMulti: false,
    dimensions: JSON.stringify(['User.firstName', 'User.lastName']),
    filters: JSON.stringify([]),
    limit: 5,
    measures: JSON.stringify(['Deal.countOfWon']),
    order: JSON.stringify([['Deal.countOfWon', 'desc']]),
    timeDimensions: JSON.stringify([]),
  },
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 5 Users - Deals Lost',
    type: 'Deal',
    relatedTypes: JSON.stringify(['User']),
    displayType: 'kpi_rankings',
    icon: 'monetization_on',
    isMulti: false,
    dimensions: JSON.stringify(['User.firstName', 'User.lastName']),
    filters: JSON.stringify([]),
    limit: 5,
    measures: JSON.stringify(['Deal.countOfLost']),
    order: JSON.stringify([['Deal.countOfLost', 'desc']]),
    timeDimensions: JSON.stringify([]),
  },
  // {
  //   id: v4(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   name: 'Open Deals by Stage - This Month',
  //   type: 'Deal',
  //   relatedTypes: JSON.stringify([]),
  //   displayType: 'chart_bar',
  //   icon: 'monetization_on',
  // },

  /**
   * Tasks
   */

  // {
  //   id: v4(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   name: 'Tasks Created - This Month',
  //   type: 'TASK',
  //   relatedTypes: JSON.stringify([]),
  //   displayType: 'kpi_standard',
  //   icon: '',
  //   isMulti: false,
  // },
  // {
  //   id: v4(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   name: 'Overdue Tasks - This Month',
  //   type: 'TASK',
  //   relatedTypes: JSON.stringify([]),
  //   displayType: 'kpi_standard',
  //   icon: '',
  //   isMulti: false,
  // },
  // {
  //   id: v4(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   name: 'Open Task - This Month',
  //   type: 'TASK',
  //   relatedTypes: JSON.stringify([]),
  //   displayType: 'kpi_standard',
  //   icon: '',
  //   isMulti: false,
  // },
  // {
  //   id: v4(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   name: 'Top 5 Users by Overdue Tasks',
  //   type: 'TASK',
  //   relatedTypes: JSON.stringify([]),
  //   displayType: 'kpi_rankings',
  //   icon: '',
  //   isMulti: false,
  // },
  // {
  //   id: v4(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   name: 'Completed Task - This Month',
  //   type: 'TASK',
  //   relatedTypes: JSON.stringify([]),
  //   displayType: 'kpi_standard',
  //   icon: '',
  //   isMulti: false,
  // },
  // {
  //   id: v4(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   name: 'Top 5 Users by Completed Tasks',
  //   type: 'TASK',
  //   relatedTypes: JSON.stringify([]),
  //   displayType: 'kpi_rankings',
  //   icon: '',
  //   isMulti: false,
  // },

  /**
   * Training
   */

  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 5 Lessons - Completed',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify(['Lesson']),
    displayType: 'kpi_rankings',
    icon: 'class',
    isMulti: false,
    dimensions: JSON.stringify(['Lesson.title']),
    filters: JSON.stringify([]),
    limit: 5,
    measures: JSON.stringify(['LessonProgress.countOfCompleted']),
    order: JSON.stringify([['LessonProgress.countOfCompleted', 'desc']]),
    segments: JSON.stringify([]),
  },
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 5 Users by Lessons Completed',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify(['User']),
    displayType: 'kpi_rankings',
    icon: 'class',
    isMulti: false,
    dimensions: JSON.stringify(['User.firstName', 'User.lastName']),
    filters: JSON.stringify([]),
    limit: 5,
    measures: JSON.stringify(['LessonProgress.countOfCompleted']),
    order: JSON.stringify([['LessonProgress.countOfCompleted', 'desc']]),
    segments: JSON.stringify([]),
  },
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 5 Courses - Completed',
    type: 'CourseProgress',
    relatedTypes: JSON.stringify(['Course']),
    displayType: 'kpi_rankings',
    icon: 'class',
    isMulti: false,
    dimensions: JSON.stringify(['Course.name']),
    filters: JSON.stringify([]),
    limit: 5,
    measures: JSON.stringify(['CourseProgress.countOfCompleted']),
    order: JSON.stringify([['CourseProgress.countOfCompleted', 'desc']]),
    segments: JSON.stringify([]),
  },
  // {
  //   id: v4(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   name: 'Top 5 Users by Courses Completed',
  //   type: 'CourseProgress',
  //   relatedTypes: JSON.stringify([]),
  //   displayType: 'kpi_rankings',
  //   icon: '',
  //   isMulti: false,
  // },
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Lessons Started - This Month',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify([]),
    displayType: 'kpi_standard',
    icon: 'class',
    isMulti: true,
    dimensions: JSON.stringify([]),
    filters: JSON.stringify([]),
    measures: JSON.stringify(['LessonProgress.count']),
    order: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        compareDateRange: ['this month', 'last month'],
        dimension: 'LessonProgress.createdAt',
      },
    ]),
  },
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Lessons Completed - This Month',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify([]),
    displayType: 'kpi_standard',
    icon: 'class',
    isMulti: true,
    dimensions: JSON.stringify([]),
    limit: 10000,
    filters: JSON.stringify([]),
    measures: JSON.stringify(['LessonProgress.countOfCompleted']),
    order: JSON.stringify([]),
    segments: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        compareDateRange: ['this month', 'last month'],
        dimension: 'LessonProgress.updatedAt',
      },
    ]),
  },

  /**
   * Survey
   */

  /**
   * Insights
   */

  // Active Training Users
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 25 Users by Lessons Completed - Last 90 Day',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify(['User']),
    displayType: 'kpi_rankings',
    icon: 'school',
    isMulti: false,
    dimensions: JSON.stringify([
      'User.firstName',
      'User.lastName',
      'User.avatar',
    ]),
    filters: JSON.stringify([
      {
        member: 'LessonProgress.status',
        operator: 'equals',
        values: ['completed'],
      },
    ]),
    limit: 25,
    measures: JSON.stringify(['LessonProgress.count']),
    order: JSON.stringify([['LessonProgress.count', 'desc']]),
    segments: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        dimension: 'LessonProgress.updatedAt',
        dateRange: 'from 90 day ago to now',
      },
    ]),
  },
  // Category Attempts
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 25 Categories by Lessons Attempted - Last 90 Day',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify(['Category']),
    displayType: 'kpi_rankings',
    icon: 'category',
    isMulti: false,
    dimensions: JSON.stringify(['Category.title']),
    filters: JSON.stringify([
      {
        member: 'LessonProgress.status',
        operator: 'notEquals',
        values: ['pending'],
      },
    ]),
    limit: 25,
    measures: JSON.stringify([
      'LessonProgress.avg',
      'LessonProgress.sumOfAttempts',
    ]),
    order: JSON.stringify([['LessonProgress.sumOfAttempts', 'desc']]),
    segments: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        dimension: 'LessonProgress.updatedAt',
        dateRange: 'from 90 day ago to now',
      },
    ]),
  },
  // Deal Performance
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Count of Deals by Status - Last 6 Months',
    type: 'Deal',
    relatedTypes: JSON.stringify([]),
    displayType: 'kpi_standard',
    icon: 'monetization_on',
    isMulti: false,
    dimensions: JSON.stringify(['Deal.status']),
    filters: JSON.stringify([]),
    limit: 10000,
    measures: JSON.stringify(['Deal.count']),
    order: JSON.stringify([['Deal.count', 'desc']]),
    segments: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        dimension: 'Deal.dateModified',
        granularity: 'month',
        dateRange: 'from 6 month ago to now',
      },
    ]),
  },
  // Lesson Attempts
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 25 Lessons Attempted - Last 90 Day',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify(['Lesson']),
    displayType: 'kpi_rankings',
    icon: 'class',
    isMulti: false,
    dimensions: JSON.stringify(['Lesson.title']),
    filters: JSON.stringify([
      {
        member: 'LessonProgress.status',
        operator: 'notEquals',
        values: ['pending'],
      },
    ]),
    limit: 25,
    measures: JSON.stringify([
      'LessonProgress.avg',
      'LessonProgress.sumOfAttempts',
    ]),
    order: JSON.stringify([['LessonProgress.sumOfAttempts', 'desc']]),
    segments: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        dimension: 'LessonProgress.updatedAt',
        dateRange: 'from 90 day ago to now',
      },
    ]),
  },
  // Lessons started and completed
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Daily Lesson Completion Rate - Last 7 Day',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify([]),
    displayType: 'chart_column',
    icon: 'local_library',
    isMulti: false,
    dimensions: JSON.stringify(['LessonProgress.status']),
    filters: JSON.stringify([
      {
        member: 'LessonProgress.status',
        operator: 'notEquals',
        values: ['pending'],
      },
    ]),
    limit: 10000,
    measures: JSON.stringify([
      'LessonProgress.count',
      'LessonProgress.avgTimeToComplete',
    ]),
    order: JSON.stringify([['LessonProgress.createdAt', 'desc']]),
    segments: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        dateRange: 'last 7 day',
        dimension: 'LessonProgress.createdAt',
        granularity: 'day',
      },
    ]),
  },
  // Lesson Leaderboard
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 25 Users by Lesson Points - Last 90 Day',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify(['User']),
    displayType: 'kpi_rankings',
    icon: 'leaderboard',
    isMulti: false,
    dimensions: JSON.stringify([
      'User.firstName',
      'User.lastName',
      'User.avatar',
    ]),
    filters: JSON.stringify([]),
    limit: 25,
    measures: JSON.stringify([
      'LessonProgress.sumOfPoints',
      'LessonProgress.countOfCompleted',
      'LessonProgress.countOfInProgress',
    ]),
    order: JSON.stringify([
      ['LessonProgress.sumOfPoints', 'desc'],
      ['LessonProgress.countOfCompleted', 'desc'],
      ['LessonProgress.countOfInProgress', 'desc'],
    ]),
    segments: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        dimension: 'LessonProgress.updatedAt',
        dateRange: 'from 90 day ago to now',
      },
    ]),
  },
  // Lessons Pending
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 25 Lessons in Progress - Last 90 Day',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify(['User']),
    displayType: 'kpi_rankings',
    icon: 'class',
    isMulti: false,
    dimensions: JSON.stringify([
      'User.firstName',
      'User.lastName',
      'User.avatar',
    ]),
    filters: JSON.stringify([
      {
        member: 'LessonProgress.status',
        operator: 'equals',
        values: ['in_progress'],
      },
    ]),
    limit: 25,
    measures: JSON.stringify(['LessonProgress.count']),
    order: JSON.stringify([['LessonProgress.count', 'desc']]),
    segments: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        dimension: 'LessonProgress.updatedAt',
        dateRange: 'from 90 day ago to now',
      },
    ]),
  },
  // Popular Lessons
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top Categories by Lesson Progress',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify(['Category']),
    displayType: 'kpi_rankings',
    icon: 'local_library',
    isMulti: false,
    dimensions: JSON.stringify(['Category.title', 'LessonProgress.status']),
    filters: JSON.stringify([
      {
        member: 'LessonProgress.status',
        operator: 'equals',
        values: ['completed'],
      },
    ]),
    limit: 10000,
    measures: JSON.stringify(['LessonProgress.count']),
    order: JSON.stringify([['LessonProgress.count', 'desc']]),
    segments: JSON.stringify([]),
  },
  // Trainings Completed
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 25 Lessons Completed - Last 90 Day',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify(['Lesson']),
    displayType: 'kpi_rankings',
    icon: 'school',
    isMulti: false,
    dimensions: JSON.stringify(['Lesson.title']),
    filters: JSON.stringify([
      {
        member: 'LessonProgress.status',
        operator: 'equals',
        values: ['completed'],
      },
    ]),
    limit: 25,
    measures: JSON.stringify(['LessonProgress.count']),
    order: JSON.stringify([['LessonProgress.count', 'desc']]),
    segments: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        dimension: 'LessonProgress.updatedAt',
        dateRange: 'from 90 day ago to now',
      },
    ]),
  },
  // Top Lessons
  {
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Top 25 Lessons In Progress - Last 90 Day',
    type: 'LessonProgress',
    relatedTypes: JSON.stringify(['Lesson']),
    displayType: 'kpi_rankings',
    icon: 'class',
    isMulti: false,
    dimensions: JSON.stringify(['Lesson.title']),
    limit: 25,
    filters: JSON.stringify([
      {
        member: 'LessonProgress.status',
        operator: 'notEquals',
        values: ['pending'],
      },
    ]),
    measures: JSON.stringify(['LessonProgress.count', 'LessonProgress.avg']),
    order: JSON.stringify([['LessonProgress.count', 'desc']]),
    segments: JSON.stringify([]),
    timeDimensions: JSON.stringify([
      {
        dimension: 'LessonProgress.updatedAt',
        dateRange: 'from 90 day ago to now',
      },
    ]),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      return Promise.all(
        seeds.map(async (seed) => {
          const metricId = await queryInterface.rawSelect(
            table,
            {
              where: {
                name: seed.name,
              },
            },
            ['id']
          );

          if (metricId) {
            delete seed.id;
            delete seed.createdAt;
            await queryInterface.bulkUpdate(table, seed, {
              id: metricId,
            });
          } else {
            await queryInterface.bulkInsert(table, [seed], {});
          }
        })
      );
    } catch (error) {
      console.error(error);
    }
  },

  async down(queryInterface, Sequelize) {},
};
