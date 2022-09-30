import { OpenAPIV3 } from 'openapi-types';

const currency = {
  description:
    'Whole number representing a tenth of a cent. e.g.: $123.45 is represented as a whole number of 123450',
  type: 'number' as const,
};

const bpsCredit = {
  description:
    'Whole number represented Basis Points. e.g.: 0.2% is represented as whole number 20 BPS.',
  type: 'number' as const,
};

const treasuryService = {
  id: {
    type: 'number',
  },
  name: {
    type: 'string',
  },
  total_items: {
    type: 'number',
    minimum: 1,
  },
  item_fee: {
    ...currency,
  },
  proposed_item_fee: {
    ...currency,
  },
};

export const schemas = {
  currency,

  fieldType: {
    type: 'string',
    enum: ['CHAR', 'TEXT', 'NUMBER', 'DATE', 'TIME'],
  } as OpenAPIV3.SchemaObject,

  user: {
    type: 'object',
    required: ['id', 'email'],
    properties: {
      id: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      first_name: {
        type: 'string',
      },
      last_name: {
        type: 'string',
      },
    },
  } as OpenAPIV3.SchemaObject,

  resourceAccess: {
    type: 'array',
    items: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
        },
      },
    },
  } as OpenAPIV3.SchemaObject,

  reportInput: {
    description: 'User input for report calculation',
    oneOf: [
      {
        description: 'Input for a treasury report',
        type: 'object',
        required: [
          'type',
          'client_name',
          'proposed_bank_name',
          'average_balance',
          'services',
        ],
        properties: {
          type: {
            type: 'string',
            enum: ['TREASURY'],
          },
          client_name: {
            type: 'string',
          },
          proposed_bank_name: {
            type: 'string',
          },
          date: {
            description: 'ISO timestamp',
            type: 'string',
          },
          average_balance: currency,
          services: {
            type: 'array',
            items: {
              type: 'object',
              required: [
                'id',
                'name',
                'total_items',
                'item_fee',
                'proposed_item_fee',
              ],
              properties: treasuryService,
            },
          },
        },
      },
    ],
  } as OpenAPIV3.SchemaObject,
  reportOutput: {
    description: 'Output calculations based on user input',
    oneOf: [
      {
        description: 'Output of a treasury input',
        type: 'object',
        required: [
          'type',
          'client_name',
          'proposed_bank_name',
          'annual_services_savings',
          'annual_estimated_savings',
          'services',
        ],
        properties: {
          type: {
            type: 'string',
            enum: ['TREASURY'],
          },
          client_name: {
            type: 'string',
          },
          proposed_bank_name: {
            type: 'string',
          },
          date: {
            description: 'ISO timestamp',
            type: 'string',
          },
          annual_services_savings: currency,
          annual_estimated_savings: currency,
          services: {
            type: 'array',
            items: {
              type: 'object',
              required: [
                'id',
                'annual_savings',
                'total_items',
                'item_fee',
                'proposed_item_fee',
              ],
              properties: {
                ...treasuryService,
                annual_savings: currency,
              },
            },
          },
        },
      },
    ],
  } as OpenAPIV3.SchemaObject,
  reportInsight: {
    type: 'object',
    required: ['id', 'created_by', 'report_id', 'type', 'hidden', 'position'],
    properties: {
      id: {
        type: 'string',
      },
      created_by: {
        type: 'string',
      },
      report_id: {
        type: 'string',
      },
      type: {
        type: 'string',
        enum: [
          'DEFAULT',
          'RPMG_ACH',
          'RPMG_CHECK',
          'RPMG_CREDIT_CARD',
          'RPMG_WIRE_TRANSFER',
        ],
      },
      hidden: {
        type: 'boolean',
      },
      position: {
        type: 'number',
      },
    },
  } as OpenAPIV3.SchemaObject,

  // TODO investigate a better way to map database models to swagger
  organization: {
    description: 'Organization model',
    type: 'object',
    required: [],
    properties: {
      id: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      // TODO how to represent DATE
      // date_entered: {
      //   type: 'string',
      // },
      // date_modified: {
      //   type: 'object',
      // },
      modified_user_id: {
        type: 'string',
      },
      created_by: {
        type: 'string',
      },
      deleted: {
        type: 'boolean',
      },
      assigned_user_id: {
        type: 'string',
      },
      industry: {
        type: 'string',
      },
      annual_revenue: {
        type: 'string',
      },
      annual_revenue_merchant: {
        type: 'string',
      },
      annual_revenue_treasury: {
        type: 'string',
      },
      annual_revenue_business_card: {
        type: 'string',
      },
      total_revenue: {
        type: 'string',
      },
      phone_fax: {
        type: 'string',
      },
      billing_address_street: {
        type: 'string',
      },
      billing_address_city: {
        type: 'string',
      },
      billing_address_state: {
        type: 'string',
      },
      billing_address_postalcode: {
        type: 'string',
      },
      billing_address_country: {
        type: 'string',
      },
      rating: {
        type: 'string',
      },
      phone_office: {
        type: 'string',
      },
      phone_alternate: {
        type: 'string',
      },
      website: {
        type: 'string',
      },
      ownership: {
        type: 'string',
      },
      employees: {
        type: 'integer',
        // TODO why doesn't db model propagate enums????
        // enum: ['1-10', '10-50', '50-100', 'more than 100'],
      },
      ticker_symbol: {
        type: 'string',
      },
      address_street: {
        type: 'string',
      },
      address_suite: {
        type: 'string',
      },
      address_city: {
        type: 'string',
      },
      address_state: {
        type: 'string',
      },
      address_postalcode: {
        type: 'string',
      },
      address_country: {
        type: 'string',
      },
      sic_code: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      naics_code: {
        type: 'string',
      },
      cif: {
        type: 'string',
      },
      branch: {
        type: 'string',
      },
      avatar: {
        type: 'string',
      },
      owners: {
        type: 'array',
        items: {
          type: 'object',
          required: ['user_id', 'organization_id', 'user'],
          properties: {
            user_id: {
              type: 'string',
            },
            organization_id: {
              type: 'string',
            },
            user: {
              type: 'object',
            },
          },
        },
      },
    },
  } as OpenAPIV3.SchemaObject,

  contactFollowers: {
    description: 'ContactFollowers model',
    type: 'object',
    required: ['user_id', 'contact_id'],
    properties: {
      user_id: {
        type: 'string',
      },
      contact_id: {
        type: 'string',
      },
    },
  } as OpenAPIV3.SchemaObject,

  organizationFollowers: {
    description: 'OrganizationFollowers model',
    type: 'object',
    required: [],
    properties: {
      user_id: {
        type: 'string',
      },
      organization_id: {
        type: 'string',
      },
    },
  } as OpenAPIV3.SchemaObject,

  googleAddress: {
    description: 'address from google',
    type: 'object',
    required: [],
    properties: {
      address: {
        type: 'string',
      },
    },
  } as OpenAPIV3.SchemaObject,

  paginationResponse: {
    description: 'Pagination response object',
    type: 'object',
    required: ['limit', 'page', 'totalPages', 'count'],
    properties: {
      limit: {
        description: 'Pagination limit',
        type: 'number',
      },
      page: {
        description: 'Current pagination page',
        type: 'number',
      },
      totalPages: {
        description: 'Total pagination pages',
        type: 'number',
      },
      count: {
        description: 'Total pagination size',
        type: 'number',
      },
    },
  } as OpenAPIV3.SchemaObject,

  naics: {
    description: 'NAICS',
    type: 'object',
    required: ['code', 'title'],
    properties: {
      code: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
    },
  } as OpenAPIV3.SchemaObject,

  merchantReport: {
    description: 'merchant report',
    type: 'object',
    required: ['controllable_cost_savings', 'authorization_to_approval_rate'],
    properties: {
      controllable_cost_savings: {
        type: 'object',
      },
      authorization_to_approval_rate: {
        type: 'object',
      },
    },
  } as OpenAPIV3.SchemaObject,

  rpmgVertical: {
    type: 'object',
    required: ['id', 'industry'],
    properties: {
      id: {
        type: 'string',
      },
      industry: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
    },
  } as OpenAPIV3.SchemaObject,
  rpmgSummary: {
    type: 'object',
    required: [
      'id',
      'rpmg_vertical_id',
      'average_p_card_spending',
      'average_p_card_transactions',
      'average_spending_per_transaction',
      'average_spending_per_mm_revenue',
    ],
    properties: {
      id: {
        type: 'string',
      },
      rpmg_vertical_id: {
        type: 'string',
      },
      average_p_card_spending: {
        type: 'number',
      },
      average_p_card_transactions: {
        type: 'number',
      },
      average_spending_per_transaction: {
        type: 'number',
      },
      average_spending_per_mm_revenue: {
        type: 'number',
      },
    },
  } as OpenAPIV3.SchemaObject,
  rpmgTransactionSummary: {
    type: 'object',
    required: [
      'id',
      'rpmg_vertical_id',
      'rpmg_transaction_id',
      'all_card_platforms',
      'checks',
      'ach',
      'wire_transfer',
    ],
    properties: {
      id: {
        type: 'string',
      },
      rpmg_vertical_id: {
        type: 'string',
      },
      rpmg_transaction_id: {
        type: 'string',
      },
      all_card_platforms: {
        type: 'number',
      },
      checks: {
        type: 'number',
      },
      ach: {
        type: 'number',
      },
      wire_transfer: {
        type: 'number',
      },
    },
  } as OpenAPIV3.SchemaObject,
  rpmgTransaction: {
    type: 'object',
    required: ['id', 'name', 'range'],
    properties: {
      id: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      range: {
        type: 'string',
      },
    },
  } as OpenAPIV3.SchemaObject,

  tenantIntegration: {
    type: 'object',
    required: [
      'id',
      'tenant_id',
      'type',
      'credentials',
      'enabled',
      'created_at',
      'updated_at',
    ],
    properties: {
      id: {
        type: 'string',
      },
      tenant_id: {
        type: 'string',
      },
      type: {
        type: 'string',
        enum: ['FISERV'],
      },
      credentials: {
        type: 'object',
        oneOf: [
          {
            type: 'object',
            required: ['url', 'client_id', 'client_secret'],
            properties: {
              url: {
                type: 'string',
              },
              client_id: {
                type: 'string',
              },
              client_secret: {
                type: 'string',
              },
            },
          },
        ],
      },
      enabled: {
        type: 'boolean',
      },
      created_at: {
        $ref: '#/components/schemas/Date',
      },
      updated_at: {
        $ref: '#/components/schemas/Date',
      },
    },
  } as OpenAPIV3.SchemaObject,
};
