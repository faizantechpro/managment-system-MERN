// @ts-nocheck

cube('CourseProgress', {
  sql: 'SELECT * FROM public.course_progress',
  dataSource: 'default',
  refreshKey: {
    every: '30 second',
  },

  joins: {
    Course: {
      relationship: 'belongsTo',
      sql: `${CUBE.courseId} = ${Course.id}`,
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
        relatedTypes: ['Course', 'Tenant', 'User'],
      },
      sql: '0',
      title: 'meta',
      type: 'number',
    },

    count: {
      drillMembers: [],
      type: 'count',
      description: 'Count of - Course Progress',
    },
    countOfCompleted: {
      filters: [
        {
          sql: `${CUBE.completedAt} IS NOT NULL`,
        },
      ],
      type: 'count',
      description: 'Count of Completed - Lesson Progress',
    },
  },

  dimensions: {
    id: {
      sql: 'id',
      type: 'string',
      primaryKey: true,
    },

    courseId: {
      sql: 'course_id',
      type: 'string',
    },

    completedAt: {
      sql: 'completed_at',
      type: 'time',
    },

    tenantId: {
      sql: 'tenant_id',
      type: 'string',
    },
  },
});
