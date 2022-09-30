// @ts-nocheck

cube('Lesson', {
  sql: 'SELECT * FROM public.lessons',
  dataSource: 'default',
  refreshKey: {
    every: '30 second',
  },

  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started
  },

  joins: {
    Category: {
      relationship: 'belongsTo',
      sql: `${CUBE.categoryId} = ${Category.id}`,
    },
    LessonProgress: {
      relationship: 'hasMany',
      sql: `${CUBE.id} = ${LessonProgress.lessonId}`,
    },
    Tenant: {
      relationship: 'belongsTo',
      sql: `${CUBE.tenantId} = ${Tenant.id}`,
    },
  },

  measures: {
    meta: {
      description: 'Related Types. Informative only, DO NOT USE',
      meta: {
        relatedTypes: ['Category', 'LessonProgress', 'Tenant'],
      },
      sql: '0',
      title: 'meta',
      type: 'number',
    },

    count: {
      type: 'count',
      drillMembers: [],
      description: 'Count of - Lesson',
    },
  },

  dimensions: {
    documents: {
      sql: 'documents',
      type: 'string',
    },

    content: {
      sql: 'content',
      type: 'string',
    },

    id: {
      sql: 'id',
      type: 'number',
      primaryKey: true,
    },

    title: {
      sql: 'title',
      type: 'string',
    },

    icon: {
      sql: 'icon',
      type: 'string',
    },

    tags: {
      sql: 'tags',
      type: 'string',
    },

    status: {
      sql: 'status',
      type: 'string',
    },

    categoryId: {
      sql: 'category_id',
      type: 'number',
    },

    createdAt: {
      sql: 'created_at',
      type: 'time',
    },

    updatedAt: {
      sql: 'updated_at',
      type: 'time',
    },

    tenantId: {
      sql: 'tenant_id',
      type: 'string',
    },
  },
});
