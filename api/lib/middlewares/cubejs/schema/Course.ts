// @ts-nocheck

cube('Course', {
  sql: 'SELECT * FROM public.courses',
  dataSource: 'default',
  refreshKey: {
    every: '30 second',
  },

  joins: {
    CourseProgress: {
      relationship: 'hasMany',
      sql: `${CUBE.id} = ${CourseProgress.courseId}`,
    },
  },

  measures: {
    meta: {
      description: 'Related Types. Informative only, DO NOT USE',
      meta: {
        relatedTypes: ['CourseProgress'],
      },
      sql: '0',
      title: 'meta',
      type: 'number',
    },
  },

  dimensions: {
    id: {
      sql: 'id',
      type: 'string',
      primaryKey: true,
    },
    name: {
      sql: 'name',
      type: 'string',
    },
  },
});
