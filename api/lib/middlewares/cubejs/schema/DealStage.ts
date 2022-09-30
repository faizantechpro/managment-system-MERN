// @ts-nocheck

cube('DealStage', {
  sql: 'SELECT * FROM public.deal_stage',
  dataSource: 'default',
  refreshKey: {
    every: '30 second',
  },

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
