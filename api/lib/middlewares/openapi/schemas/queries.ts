import { OpenAPIV3 } from 'openapi-types';

export const queries = {
  pagination: [
    {
      in: 'query',
      name: 'page',
      schema: {
        type: 'number',
        minimum: 1,
      },
      required: true,
    },
    {
      in: 'query',
      name: 'limit',
      schema: {
        type: 'number',
        minimum: 0,
        maximum: 1000,
      },
      required: true,
    },
  ] as OpenAPIV3.ParameterObject[],

  search: {
    in: 'query',
    name: 'search',
    schema: {
      type: 'string',
    },
  } as OpenAPIV3.ParameterObject,

  self: {
    in: 'query',
    name: 'self',
    schema: {
      description:
        'Filters result by self. As users with elevated permissions can query\n' +
        'data across a tenant(s) and user(s), there may be situations where a\n' +
        'user would like to see data related only about themselves.',
      type: 'boolean',
    },
    required: false,
  } as OpenAPIV3.ParameterObject,

  tenantId: {
    in: 'query',
    name: 'tenantId',
    schema: {
      description: 'Allows tenant id querying. Only usable by admins',
      type: 'string',
      format: 'uuid',
    },
    required: false,
  } as OpenAPIV3.ParameterObject,
};
