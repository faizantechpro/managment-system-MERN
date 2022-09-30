type Action = 'view' | 'create' | 'edit' | 'delete';

export const permissions: {
  [K in string]: {
    [A in Action]?: { collection: string; action: A };
  };
} = {
  accounts: {
    view: { collection: 'accounts', action: 'view' },
    create: { collection: 'accounts', action: 'create' },
    edit: { collection: 'accounts', action: 'edit' },
    delete: { collection: 'accounts', action: 'delete' },
  },
  contacts: {
    view: { collection: 'contacts', action: 'view' },
    create: { collection: 'contacts', action: 'create' },
    edit: { collection: 'contacts', action: 'edit' },
    delete: { collection: 'contacts', action: 'delete' },
  },
  deals: {
    view: { collection: 'deals', action: 'view' },
    create: { collection: 'deals', action: 'create' },
    delete: { collection: 'deals', action: 'delete' },
  },
  categories: {
    view: { collection: 'categories', action: 'view' },
    create: { collection: 'categories', action: 'create' },
    edit: { collection: 'categories', action: 'edit' },
    delete: { collection: 'categories', action: 'delete' },
  },
  courses: {
    view: { collection: 'courses', action: 'view' },
    create: { collection: 'contacts', action: 'create' },
    edit: { collection: 'contacts', action: 'edit' },
    delete: { collection: 'contacts', action: 'delete' },
  },
  lessons: {
    view: { collection: 'lessons', action: 'view' },
    create: { collection: 'lessons', action: 'create' },
    edit: { collection: 'lessons', action: 'edit' },
    delete: { collection: 'lessons', action: 'delete' },
  },
  quizzes: {
    view: { collection: 'quizzes', action: 'view' },
    create: { collection: 'quizzes', action: 'create' },
    edit: { collection: 'quizzes', action: 'edit' },
    delete: { collection: 'quizzes', action: 'delete' },
  },
  learningPath: {
    view: { collection: 'courses', action: 'view' },
  },
};
