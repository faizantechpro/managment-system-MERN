export const availableReports = [
  {
    id: 'deals_performance',
    title: 'Deals performance',
    icon: 'monetization_on',
  },
  {
    id: 'deals_conversion',
    title: 'Deals Conversion',
    icon: 'monetization_on',
  },
  {
    id: 'lessons_started_and_completed',
    title: 'Lessons started and completed',
    icon: 'local_library',
  },
  {
    id: 'popular_lessons',
    title: 'Popular lessons',
    icon: 'local_library',
  },
];

export const dealsData = [
  {
    name: 'open',
    color: '#082ace',
    include: ['hot', 'cold', 'warm'],
  },
  {
    name: 'lost',
    color: '#28ae60',
    include: ['lost'],
  },
  {
    name: 'won',
    color: '#FF5A2D',
    include: ['won'],
  },
];

export const dealsListProgress = [
  { name: 'cold', color: '#0A2ACE', title: 'Cold Lead' },
  { name: 'warm', color: '#28AE60', title: 'Warm Lead' },
  { name: 'hot', color: '#FF5A2B', title: 'Hot Lead' },
  { name: 'won', color: '#9B51DF', title: 'Closed - Won' },
  { name: 'lost', color: '#02C9DB', title: 'Closed - Lost' },
];
