// @ts-nocheck

cube('Contact', {
  sql: 'SELECT * FROM public.contacts',
  dataSource: 'default',
  refreshKey: {
    every: '30 second',
  },

  joins: {
    Tenant: {
      relationship: 'belongsTo',
      sql: `${CUBE.tenantId} = ${Tenant.id}`,
    },
  },

  measures: {
    meta: {
      description: 'Related Types. Informative only, DO NOT USE',
      meta: {
        relatedTypes: ['Tenant'],
      },
      sql: '0',
      title: 'meta',
      type: 'number',
    },

    count: {
      drillMembers: [],
      type: 'count',
      description: 'Count of - Contact',
    },
  },

  dimensions: {
    id: {
      sql: 'id',
      type: 'string',
      primaryKey: true,
    },
    tenantId: {
      sql: 'tenant_id',
      type: 'string',
    },
    dateEntered: {
      sql: 'date_entered',
      type: 'time',
    },
    dateModified: {
      sql: 'date_modified',
      type: 'time',
    },
  },
});
