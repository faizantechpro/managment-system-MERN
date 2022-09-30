// @ts-nocheck
cube('User', {
  sql: 'SELECT * FROM public.users',
  dataSource: 'default',
  refreshKey: {
    every: '30 second',
  },

  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started
  },

  joins: {
    Deal: {
      relationship: 'belongsTo',
      sql: `${CUBE.id} = ${Deal.assignedUserId}`,
    },
    LessonProgress: {
      relationship: 'belongsTo',
      sql: `${CUBE.id} = ${LessonProgress.userId}`,
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
        relatedTypes: ['Deal', 'LessonProgress', 'Tenant'],
      },
      sql: '0',
      title: 'meta',
      type: 'number',
    },

    count: {
      type: 'count',
      drillMembers: [],
    },
  },

  dimensions: {
    id: {
      sql: 'id',
      type: 'string',
      primaryKey: true,
    },

    tags: {
      sql: 'tags',
      type: 'string',
    },

    role: {
      sql: 'role',
      type: 'string',
    },

    firstName: {
      sql: 'first_name',
      type: 'string',
    },

    lastName: {
      sql: 'last_name',
      type: 'string',
    },

    fullName: {
      sql: `CONCAT(${CUBE.firstName}, ' ', ${CUBE.lastName})`,
      type: 'string',
    },

    email: {
      sql: 'email',
      type: 'string',
    },

    location: {
      sql: 'location',
      type: 'string',
    },

    title: {
      sql: 'title',
      type: 'string',
    },

    description: {
      sql: 'description',
      type: 'string',
    },

    avatar: {
      sql: 'avatar',
      type: 'string',
    },

    status: {
      sql: 'status',
      type: 'string',
    },

    lastPage: {
      sql: 'last_page',
      type: 'string',
    },

    phone: {
      sql: 'phone',
      type: 'string',
    },

    lastAccess: {
      sql: 'last_access',
      type: 'time',
    },
    tenantId: {
      sql: 'tenant_id',
      type: 'string',
    },
  },
});

cube('CreatedBy', { extends: User });
cube('AssignedUser', { extends: User });
