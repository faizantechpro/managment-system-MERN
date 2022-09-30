// @ts-nocheck

cube('Deal', {
  sql: 'SELECT * FROM public.deals',
  dataSource: 'default',
  refreshKey: {
    every: '30 second',
  },

  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started
  },

  joins: {
    AssignedUser: {
      relationship: 'belongsTo',
      sql: `${CUBE.assignedUserId} = ${AssignedUser.id}`,
    },
    CreatedBy: {
      relationship: 'belongsTo',
      sql: `${CUBE.createdBy} = ${CreatedBy.id}`,
    },
    Tenant: {
      relationship: 'belongsTo',
      sql: `${CUBE.tenantId} = ${Tenant.id}`,
    },
    TenantDealStage: {
      relationship: 'belongsTo',
      sql: `${CUBE.tenantDealStageId} = ${TenantDealStage.id}`,
    },
  },

  measures: {
    meta: {
      description: 'Related Types. Informative only, DO NOT USE',
      meta: {
        relatedTypes: [
          'AssignedUser',
          'CreatedBy',
          'Tenant',
          'TenantDealStage',
        ],
      },
      sql: '0',
      title: 'meta',
      type: 'number',
    },

    count: {
      drillMembers: [],
      type: 'count',
      description: 'Count of - Deal',
    },
    countOfWon: {
      sql: `CASE WHEN ${CUBE}.status = 'won' THEN 1 END`,
      type: 'count',
      description: 'Count of Won - Deal',
    },
    countOfLost: {
      sql: `CASE WHEN ${CUBE}.status = 'lost' THEN 1 END`,
      type: 'count',
      description: 'Count of Lost - Deal',
    },
    sumOfPendingRevenue: {
      sql: `CASE WHEN ${CUBE}.status IS DISTINCT FROM 'won' THEN ${CUBE}.amount ELSE 0 END`,
      type: 'sum',
      description: 'Sum of Pending Revenue (Not Won) - Deal',
    },
    sumOfRevenue: {
      sql: `CASE WHEN ${CUBE}.status = 'won' THEN ${CUBE}.amount ELSE 0 END`,
      type: 'sum',
      description: 'Sum of Revenue (Won) - Deal',
    },
    uniqueCountOfTenantDealStageId: {
      sql: 'tenant_deal_stage_id',
      type: 'count',
      description: 'Unique Count of Tenant Deal Stage Id - Deal',
    },
  },

  dimensions: {
    salesStage: {
      sql: 'sales_stage',
      type: 'string',
    },

    id: {
      sql: 'id',
      type: 'string',
      primaryKey: true,
    },

    leadSource: {
      sql: 'lead_source',
      type: 'string',
    },

    name: {
      sql: 'name',
      type: 'string',
    },

    amount: {
      sql: 'amount',
      type: 'string',
    },

    contactPersonId: {
      sql: 'contact_person_id',
      type: 'string',
    },

    contactOrganizationId: {
      sql: 'contact_organization_id',
      type: 'string',
    },

    modifiedUserId: {
      sql: 'modified_user_id',
      type: 'string',
    },

    currency: {
      sql: 'currency',
      type: 'string',
    },

    deleted: {
      sql: 'deleted',
      type: 'string',
    },

    description: {
      sql: 'description',
      type: 'string',
    },

    nextStep: {
      sql: 'next_step',
      type: 'string',
    },

    lastStatusUpdate: {
      sql: 'last_status_update',
      type: 'time',
    },

    dateClosed: {
      sql: 'date_closed',
      type: 'time',
    },

    dateEntered: {
      sql: 'date_entered',
      type: 'time',
    },

    dateModified: {
      sql: 'date_modified',
      type: 'time',
    },

    dateLostClosed: {
      sql: 'date_lost_closed',
      type: 'time',
    },

    dateWonClosed: {
      sql: 'date_won_closed',
      type: 'time',
    },

    status: {
      sql: 'status',
      type: 'string',
    },

    tenantDealStageId: {
      sql: 'tenant_deal_stage_id',
      type: 'string',
    },

    createdById: {
      sql: 'created_by',
      type: 'string',
    },
    assignedUserId: {
      sql: 'assigned_user_id',
      type: 'string',
    },
    tenantId: {
      sql: 'tenant_id',
      type: 'string',
    },
  },
});
