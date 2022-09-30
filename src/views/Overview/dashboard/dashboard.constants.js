import { isToFixedNoRound } from '../../../utils/Utils';

export const DASHBOARDS_LIST = [
  { id: 1, name: 'Overview', key: 'Overview', icon: 'list_alt' },
  { id: 2, name: 'Deals', key: 'Deals', icon: 'monetization_on' },
  { id: 3, name: 'Training', key: 'Training', icon: 'school' },
  { id: 4, name: 'Tasks', key: 'Tasks', icon: 'task_alt' },
];

export const ProgressData = {
  1: {
    headers: [
      { id: 1, name: 'This Month', color: 'bg-blue' },
      { id: 2, name: 'Last Month', color: 'bg-orange' },
    ],
    data: [
      {
        id: 1,
        name: 'Qualified',
        values: [
          { id: 1, value: 46, color: 'bg-blue' },
          { id: 2, value: 15, color: 'bg-orange' },
        ],
      },
      {
        id: 2,
        name: 'Meeting',
        values: [
          { id: 1, value: 40, color: 'bg-blue' },
          { id: 2, value: 18, color: 'bg-orange' },
        ],
      },
      {
        id: 3,
        name: 'Proposal',
        values: [
          { id: 1, value: 40, color: 'bg-blue' },
          { id: 2, value: 100, color: 'bg-orange' },
        ],
      },
      {
        id: 4,
        name: 'Negotiations',
        values: [
          { id: 1, value: 17, color: 'bg-blue' },
          { id: 2, value: 10, color: 'bg-orange' },
        ],
      },
    ],
  },
};

export const StatsData = {
  1: {
    count: 133,
    lastMonth: 190,
    percentage: -30,
  },
  2: {
    count: 47,
    lastMonth: 41,
    percentage: 15,
  },
  3: {
    count: 66,
    lastMonth: 88,
    percentage: -25,
  },
  4: {
    count: 136,
    lastMonth: 72,
    percentage: 90,
  },
  5: {
    count: 61,
    lastMonth: 101,
    percentage: -67,
  },
  6: {
    count: isToFixedNoRound(12900),
    lastMonth: isToFixedNoRound(12120),
    percentage: 6,
  },
};

export const ListData = {
  1: [
    { id: 1, name: 'Arlene Olson', count: 93 },
    { id: 2, name: 'Roger Coleman', count: 65 },
    { id: 3, name: 'Alicia Nelson', count: 60 },
    { id: 4, name: 'Felicia Burke', count: 41 },
    { id: 5, name: 'Mabel Erickson', count: 32 },
  ],
  2: [
    { id: 1, name: 'Lloyd Norris', count: 19 },
    { id: 2, name: 'Jimmy Fleming', count: 15 },
    { id: 3, name: 'Hector Morgan', count: 14 },
    { id: 4, name: 'Laura Hall', count: 10 },
    { id: 5, name: 'Virgil Hughes', count: 6 },
  ],
  3: [
    { id: 1, name: 'Payment Technology - Nonprofit Use Case', count: 19 },
    { id: 2, name: 'Why Manage Financial Risk?', count: 15 },
    { id: 3, name: 'How to Guide: Adding A Profile Picture', count: 14 },
    { id: 4, name: 'What is Healthcare Receivables Management?', count: 10 },
    { id: 5, name: 'What is the main purpose of HRM?', count: 6 },
  ],
  4: [
    { id: 1, name: 'Payment Technology', count: 19 },
    { id: 2, name: 'Market Insights', count: 15 },
    { id: 3, name: 'Understanding Card Payments', count: 14 },
    { id: 4, name: 'Treasury Management Sales Strategy', count: 10 },
    { id: 5, name: 'Faster Payments 101', count: 6 },
  ],
  5: [
    { id: 1, name: 'Arlene Olson', count: 93 },
    { id: 2, name: 'Roger Coleman', count: 65 },
    { id: 3, name: 'Alicia Nelson', count: 60 },
    { id: 4, name: 'Felicia Burke', count: 41 },
    { id: 5, name: 'Mabel Erickson', count: 32 },
  ],
  6: [
    { id: 1, name: 'Lloyd Norris', count: 19 },
    { id: 2, name: 'Jimmy Fleming', count: 15 },
    { id: 3, name: 'Hector Morgan', count: 14 },
    { id: 4, name: 'Laura Hall', count: 10 },
    { id: 5, name: 'Virgil Hughes', count: 6 },
  ],
  7: [
    {
      id: 1,
      name: 'Pearson and Hardon',
      count: '19 Deals',
      revenue: isToFixedNoRound(12100),
    },
    {
      id: 2,
      name: 'ABC Corp.',
      count: '15 Deals',
      revenue: isToFixedNoRound(21222),
    },
    {
      id: 3,
      name: 'World Wide Technologies',
      count: '14 Deals',
      revenue: isToFixedNoRound(12223),
    },
    {
      id: 4,
      name: 'Amazon',
      count: '10 Deals',
      revenue: isToFixedNoRound(43111),
    },
    {
      id: 5,
      name: 'Apple Inc.',
      count: '6 Deals',
      revenue: isToFixedNoRound(11232),
    },
  ],
};

export const DashboardComponentTypes = {
  Stat: 1,
  VChart: 2,
  HChart: 3,
  List: 4,
  Progress: 5,
};

export const COMPONENTS_BY_DASH_ID = {
  Overview: [
    {
      id: 11,
      name: 'Contacts Created - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[1],
    },
    {
      id: 21,
      name: 'Revenue Won by Month',
      type: DashboardComponentTypes.VChart,
      data: ProgressData[1],
      style: { height: 345 },
    },
    {
      id: 31,
      name: 'Top 5 Organizations',
      type: DashboardComponentTypes.List,
      data: ListData[7],
    },
    {
      id: 41,
      name: 'Deals Lost - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[2],
    },
    {
      id: 51,
      name: 'Activities Completed - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[5],
    },
    {
      id: 61,
      name: 'Tasks Closed - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[4],
    },
    {
      id: 71,
      name: 'Deals Won - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[3],
    },
  ],
  Deal: [
    {
      id: 12,
      name: 'Open Deals - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[1],
    },
    {
      id: 22,
      name: 'Top 5 Users - Deals Won',
      type: DashboardComponentTypes.List,
      data: ListData[1],
    },
    {
      id: 32,
      name: 'Top 5 Users - Deals Lost',
      type: DashboardComponentTypes.List,
      data: ListData[2],
    },
    {
      id: 42,
      name: 'Deals Won - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[2],
    },
  ],
  Training: [
    {
      id: 13,
      name: 'Top 5 Lessons - Completed',
      type: DashboardComponentTypes.List,
      data: ListData[3],
    },
    {
      id: 23,
      name: 'Top 5 Courses - Completed',
      type: DashboardComponentTypes.List,
      data: ListData[4],
    },
    {
      id: 33,
      name: 'Lessons Started - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[1],
    },
    {
      id: 43,
      name: 'Top 5 Users By Lessons Completed',
      type: DashboardComponentTypes.List,
      data: ListData[6],
    },
    {
      id: 53,
      name: 'Top 5 Users By Courses Completed',
      type: DashboardComponentTypes.List,
      data: ListData[5],
    },
    {
      id: 63,
      name: 'Lessons Completed - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[3],
    },
  ],
  Tasks: [
    {
      id: 14,
      name: 'Tasks Created - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[5],
    },
    {
      id: 24,
      name: 'Open Task - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[2],
    },
    {
      id: 34,
      name: 'Completed Task - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[3],
    },
    {
      id: 44,
      name: 'Overdue Tasks - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[4],
    },
    {
      id: 24,
      name: 'Top 5 Users By Overdue Tasks',
      type: DashboardComponentTypes.List,
      data: ListData[1],
    },
    {
      id: 34,
      name: 'Top 5 Users By Completed Tasks',
      type: DashboardComponentTypes.List,
      data: ListData[2],
    },
  ],
  Survey: [
    {
      id: 37,
      name: 'Completed Task - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[3],
    },
    {
      id: 47,
      name: 'Overdue Tasks - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[4],
    },
    {
      id: 47,
      name: 'Top 5 Users By Lessons Completed',
      type: DashboardComponentTypes.List,
      data: ListData[6],
    },
    {
      id: 57,
      name: 'Top 5 Users By Courses Completed',
      type: DashboardComponentTypes.List,
      data: ListData[5],
    },
    {
      id: 67,
      name: 'Open Deals by Stage - This Month',
      type: DashboardComponentTypes.Progress,
      data: ProgressData[1],
      className: 'expanded',
    },
  ],
};

export const MIXED_COMPONENTS = [
  {
    id: 37,
    name: 'Completed Task - This Month',
    type: DashboardComponentTypes.Stat,
    data: StatsData[3],
  },
  {
    id: 47,
    name: 'Overdue Tasks - This Month',
    type: DashboardComponentTypes.Stat,
    data: StatsData[4],
  },
  {
    id: 47,
    name: 'Top 5 Users By Lessons Completed',
    type: DashboardComponentTypes.List,
    data: ListData[6],
  },
  {
    id: 57,
    name: 'Top 5 Users By Courses Completed',
    type: DashboardComponentTypes.List,
    data: ListData[5],
  },
  {
    id: 67,
    name: 'Open Deals by Stage - This Month',
    type: DashboardComponentTypes.Progress,
    data: ProgressData[1],
    className: 'expanded',
  },
];
