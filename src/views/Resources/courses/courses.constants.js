export const courseStatus = [
  { id: 1, name: 'published', title: 'Published' },
  { id: 2, name: 'draft', title: 'Draft' },
];

export const coursePathLearning = [
  { id: 1, title: 'Yes', name: 'Yes' },
  { id: 2, title: 'No', name: 'No' },
];

export const initialFiltersItems = [
  {
    id: 1,
    label: 'Status',
    name: 'status',
    options: courseStatus,
    type: 'select',
  },
  {
    id: 2,
    label: 'LEARNING PATH',
    name: 'is_learning_path',
    options: coursePathLearning,
    type: 'select',
  },
];

export const courseInit = {
  id: '',
  name: '',
  description: '',
  is_learning_path: false,
  category: {},
  quiz: {},
  badge: {},
};

export const required = [
  { key: 'name', text: 'name', type: 'text', empty: false },
  { key: 'badge_id', text: 'badge', type: 'text', empty: false },
  { key: 'quiz_id', text: 'quiz', type: 'text', empty: false },
  { key: 'lessons', text: 'lessons', type: 'array', min: 2 },
];
