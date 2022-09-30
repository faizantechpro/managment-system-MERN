// @ts-nocheck
cube('Tenant', {
  sql: 'SELECT * FROM public.tenants',
  dataSource: 'default',
  refreshKey: {
    every: '30 second',
  },

  preAggregations: {},

  joins: {},

  measures: {
    meta: {
      description: 'Related Types. Informative only, DO NOT USE',
      meta: {
        relatedTypes: [],
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
