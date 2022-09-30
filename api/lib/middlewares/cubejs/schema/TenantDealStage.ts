// @ts-nocheck

cube('TenantDealStage', {
  sql: 'SELECT * FROM public.tenant_deal_stage',
  dataSource: 'default',
  refreshKey: {
    every: '30 second',
  },

  joins: {
    DealStage: {
      relationship: 'belongsTo',
      sql: `${CUBE.dealStageId} = ${DealStage.id}`,
    },
  },

  measures: {
    meta: {
      description: 'Related Types. Informative only, DO NOT USE',
      meta: {
        relatedTypes: ['DealStage'],
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
    dealStageId: {
      sql: 'deal_stage_id',
      type: 'string',
    },
  },
});
