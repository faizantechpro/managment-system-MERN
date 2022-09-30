// @ts-nocheck

cube('LessonProgress', {
  sql: 'SELECT * FROM public.lesson_trackings',
  dataSource: 'default',
  refreshKey: {
    every: '30 second',
  },

  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started
  },

  joins: {
    Lesson: {
      relationship: 'belongsTo',
      sql: `${CUBE.lessonId} = ${Lesson.id}`,
    },
    Tenant: {
      relationship: 'belongsTo',
      sql: `${CUBE.tenantId} = ${Tenant.id}`,
    },
    User: {
      relationship: 'belongsTo',
      sql: `${CUBE.userId} = ${User.id}`,
    },
  },

  measures: {
    meta: {
      description: 'Related Types. Informative only, DO NOT USE',
      meta: {
        relatedTypes: ['Lesson', 'Tenant', 'User'],
      },
      sql: '0',
      title: 'meta',
      type: 'number',
    },

    avg: {
      sql: 'progress',
      type: 'avg',
      description: 'Avg of - Lesson Progress',
    },
    avgTimeToComplete: {
      sql: `AVG(EXTRACT(epoch from ${CUBE}.completed_at::timestamp - ${CUBE}.created_at::timestamp))`,
      type: 'number',
      description: 'Avg time to complete (minutes) - Lesson Progress',
    },
    count: {
      drillMembers: [],
      type: 'count',
      description: 'Count of - Lesson Progress',
    },
    countOfCompleted: {
      filters: [
        {
          sql: `${CUBE}.status = 'completed'`,
        },
      ],
      type: 'count',
      description: 'Count of Completed - Lesson Progress',
    },
    countOfInProgress: {
      filters: [
        {
          sql: `${CUBE}.status = 'in_progress'`,
        },
      ],
      type: 'count',
      description: 'Count of In Progress - Lesson Progress',
    },
    sumOfAttempts: {
      sql: `COALESCE(${CUBE}.attempts, 1)`,
      type: 'sum',
      description: 'Sum of Attempts - Lesson Progress',
    },
    sumOfPoints: {
      sql: `COALESCE(${CUBE}.points, 0)`,
      type: 'sum',
      description: 'Sum of Points - Lesson Progress',
    },
  },

  dimensions: {
    status: {
      sql: 'status',
      type: 'string',
    },

    id: {
      sql: 'id',
      type: 'number',
      primaryKey: true,
    },

    lessonId: {
      sql: 'lesson_id',
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

    startedAt: {
      sql: 'started_at',
      type: 'time',
    },

    lastAttemptedAt: {
      sql: 'last_attempted_at',
      type: 'time',
    },

    completedAt: {
      sql: 'completed_at',
      type: 'time',
    },
    points: {
      sql: 'points',
      type: 'number',
    },
    progress: {
      sql: 'progress',
      type: 'number',
    },
    attempts: {
      sql: 'progress',
      type: 'number',
    },

    userId: {
      sql: 'user_id',
      type: 'string',
    },
    tenantId: {
      sql: 'tenant_id',
      type: 'string',
    },
  },
});
