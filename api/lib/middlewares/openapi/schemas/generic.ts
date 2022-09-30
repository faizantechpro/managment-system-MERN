import { OpenAPIV3 } from 'openapi-types';
import { generateJSONBase } from '.'; // index import required due to cyclic issues
import { parameters } from './parameters';
import { queries } from './queries';
import {
  generateErrorResponseSchema,
  generateResponseSchema,
  responses,
} from './responses';
import { schemas } from './schemas';

// @deprecated
export type ParentResourceType = 'Contact' | 'Deal' | 'Organization';

// For all other use
export type GenericResourceType = 'contact' | 'deal' | 'organization';
// For OpenAPI operation id
export type GenericResourceTypeOp = Capitalize<GenericResourceType>;
type ParentParameter = `${GenericResourceType}Id`;
type ParentDBKey = `${GenericResourceType}_id`;

/**
 * Generic owner documentation objects
 */

function generateOwnerSchema(key: ParentDBKey) {
  return {
    type: 'object',
    required: ['user_id', key],
    properties: {
      user_id: {
        type: 'string',
      },
      [key]: {
        type: 'string',
      },
    },
  } as OpenAPIV3.SchemaObject;
}

export function generateGetAssociatedOwners(op: GenericResourceTypeOp) {
  const opId = `getAssociated${op}Owners` as const;
  return {
    opId,
    schema: {
      operationId: opId,
      summary: `Get Associated ${op} Owners`,
      tags: ['owners'],
      security: [{ Bearer: [] }],
      parameters: [...queries.pagination],
      responses: {
        200: generateResponseSchema({
          type: 'object',
          required: ['data'],
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        }),
      },
    },
  };
}

export function generateGetOwners<T extends ParentResourceType>(type: T) {
  return {
    operationId: `get${type}Owners` as const,
    summary: `Get a ${type.toLowerCase()}'s owner list`,
    description: `Get a ${type.toLowerCase()}'s owner list`,
    tags: ['owners'],
    security: [{ Bearer: [] }],
    parameters: [
      ...queries.pagination,
      parameters[`${type.toLowerCase()}Id` as ParentParameter],
    ],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['data', 'pagination'],
        properties: {
          data: {
            type: 'array',
            items: generateOwnerSchema(
              `${type.toLowerCase()}_id` as ParentDBKey
            ),
          },
          pagination: schemas.paginationResponse,
        },
      }),
    },
  };
}

export function generateAddOwner<T extends ParentResourceType>(type: T) {
  return {
    operationId: `add${type}Owner` as const,
    summary: `Add ${type.toLowerCase()} owner`,
    description: `Add a(n) ${type.toLowerCase()} owner`,
    tags: ['owners'],
    security: [{ Bearer: [] }],
    parameters: [
      parameters.userId,
      parameters[`${type.toLowerCase()}Id` as ParentParameter],
    ],
    requestBody: {
      required: false,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: false,
        properties: {},
      }),
    },
    responses: {
      200: generateResponseSchema(
        generateOwnerSchema(`${type.toLowerCase()}_id` as ParentDBKey)
      ),
    },
  };
}

export function generateRemoveOwner<T extends ParentResourceType>(type: T) {
  return {
    operationId: `remove${type}Owner` as const,
    summary: `Remove ${type.toLowerCase()} owner`,
    description: `Remove a(n) ${type.toLowerCase()} owner`,
    tags: ['owners'],
    security: [{ Bearer: [] }],
    parameters: [
      parameters.userId,
      parameters[`${type.toLowerCase()}Id` as ParentParameter],
    ],
    requestBody: {
      required: false,
      ...generateJSONBase({
        type: 'object',
        additionalProperties: false,
        properties: {},
      }),
    },
    responses: {
      200: generateResponseSchema({
        description: 'Successfully removed owner',
        type: 'object',
        required: [],
        properties: {},
      }),
      404: responses.notFound.generate('Owner'),
    },
  };
}

/**
 * Generic field by resource documentation objects
 */

function generateFieldByResourceSchema(key: ParentDBKey, isCreation: boolean) {
  return {
    type: 'object',
    required: isCreation
      ? ['field_id', 'value']
      : ['id', key, 'created_by', 'field_id', 'value'],
    properties: {
      ...(isCreation
        ? {}
        : {
            id: {
              type: 'string',
            },
            created_by: {
              type: 'string',
            },
            [key]: {
              type: 'string',
            },
          }),

      field_id: {
        type: 'string',
      },

      value: {
        oneOf: [
          { type: 'string' }, // also holds date
          { type: 'number' },
          { type: 'boolean' },
        ],
      },
    },
  } as OpenAPIV3.SchemaObject;
}

export function generateGetFieldsByResource<T extends ParentResourceType>(
  type: T
) {
  return {
    operationId: `get${type}Fields` as const,
    summary: `Get a ${type.toLowerCase()}'s field list`,
    description: `Get a ${type.toLowerCase()}'s field list`,
    tags: ['fields'],
    security: [{ Bearer: [] }],
    parameters: [
      ...queries.pagination,
      parameters[`${type.toLowerCase()}Id` as ParentParameter],
    ],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['data', 'pagination'],
        properties: {
          data: {
            type: 'array',
            items: generateFieldByResourceSchema(
              `${type.toLowerCase()}_id` as ParentDBKey,
              false
            ),
          },
          pagination: schemas.paginationResponse,
        },
      }),
    },
  };
}

export function generateGetFieldByResource<T extends ParentResourceType>(
  type: T
) {
  return {
    operationId: `get${type}Field` as const,
    summary: `Get a ${type.toLowerCase()}'s field`,
    description: `Get a ${type.toLowerCase()}'s field`,
    tags: ['fields'],
    security: [{ Bearer: [] }],
    parameters: [
      parameters[`${type.toLowerCase()}Id` as ParentParameter],
      parameters.fieldId,
    ],
    responses: {
      200: generateResponseSchema(
        generateFieldByResourceSchema(
          `${type.toLowerCase()}_id` as ParentDBKey,
          false
        )
      ),
      404: responses.notFound.generate('Field'),
    },
  };
}

export function generateUpsertFieldByResource<T extends ParentResourceType>(
  type: T
) {
  return {
    operationId: `upsert${type}Field` as const,
    summary: `Upsert ${type.toLowerCase()} field`,
    description: `Upsert a(n) ${type.toLowerCase()} field`,
    tags: ['fields'],
    security: [{ Bearer: [] }],
    parameters: [parameters[`${type.toLowerCase()}Id` as ParentParameter]],
    requestBody: {
      ...generateJSONBase(
        generateFieldByResourceSchema(
          `${type.toLowerCase()}_id` as ParentDBKey,
          true
        )
      ),
    },
    responses: {
      200: generateResponseSchema(
        generateFieldByResourceSchema(
          `${type.toLowerCase()}_id` as ParentDBKey,
          false
        )
      ),
      400: generateErrorResponseSchema({
        description: 'Invalid input provided',
        errors: [
          {
            title: 'Invalid value provided for specified field',
          },
        ],
      }),
      404: responses.notFound.generate('Field'),
    },
  };
}

export function generateRemoveFieldByResource<T extends ParentResourceType>(
  type: T
) {
  return {
    operationId: `remove${type}Field` as const,
    summary: `Remove ${type.toLowerCase()} field`,
    description: `Remove a(n) ${type.toLowerCase()} field`,
    tags: ['fields'],
    security: [{ Bearer: [] }],
    parameters: [
      parameters[`${type.toLowerCase()}Id` as ParentParameter],
      parameters.fieldId,
    ],
    responses: {
      200: generateResponseSchema({}),
      404: responses.notFound.generate('Field'),
    },
  };
}

/**
 * Generic field documentation objects
 */

function generateFieldSchema(isCreation: boolean) {
  return {
    type: 'object' as const,
    required: isCreation
      ? ['key', 'field_type', 'order']
      : ['id', 'created_by', 'value_type', 'key', 'field_type', 'order'],
    properties: {
      ...(isCreation
        ? {}
        : {
            id: {
              type: 'string',
            },
            created_by: {
              type: 'string',
            },
            value_type: {
              type: 'string',
              enum: ['number', 'string', 'boolean', 'date', 'object'],
            },
          }),

      key: {
        type: 'string',
      },
      field_type: schemas.fieldType,
      order: {
        type: 'number',
        minimum: 0,
      },
    },
  } as OpenAPIV3.SchemaObject;
}

function generateFieldResponseSchema<T extends ParentResourceType>(type: T) {
  const response = generateFieldSchema(false);

  return {
    ...response,
    required:
      type === 'Contact'
        ? [...response.required!, 'total_contacts']
        : type === 'Deal'
        ? [...response.required!, 'total_deals']
        : [...response.required!, 'total_organizations'],
    properties: {
      ...response.properties,
      ...(type === 'Contact'
        ? {
            total_contacts: {
              description: 'Total contacts that have used this field',
              type: 'number',
            },
          }
        : type === 'Deal'
        ? {
            total_deals: {
              description: 'Total deals that have used this field',
              type: 'number',
            },
          }
        : {
            total_organizations: {
              description: 'Total organizations that have used this field',
              type: 'number',
            },
          }),
    },
  } as OpenAPIV3.SchemaObject;
}

export function generateGetFields<T extends ParentResourceType>(type: T) {
  return {
    operationId: `get${type}sFields` as const,
    summary: `Get ${type.toLowerCase()}s' field list`,
    description: `Get ${type.toLowerCase()}s' field list`,
    tags: ['fields'],
    security: [{ Bearer: [] }],
    parameters: [...queries.pagination],
    responses: {
      200: generateResponseSchema({
        type: 'object',
        required: ['data', 'pagination'],
        properties: {
          data: {
            type: 'array',
            items: {
              ...generateFieldResponseSchema(type),
            },
          },
          pagination: schemas.paginationResponse,
        },
      }),
    },
  };
}

export function generateGetField<T extends ParentResourceType>(type: T) {
  return {
    operationId: `get${type}sField` as const,
    summary: `Get a(n) ${type.toLowerCase()}s' field`,
    description: `Get a(n) ${type.toLowerCase()}s' field list`,
    tags: ['fields'],
    security: [{ Bearer: [] }],
    parameters: [parameters.fieldId],
    responses: {
      200: generateResponseSchema(generateFieldResponseSchema(type)),
      404: responses.notFound.generate('Field'),
    },
  };
}

export function generateUpsertField<T extends ParentResourceType>(type: T) {
  return {
    operationId: `upsert${type}sField` as const,
    summary: `Upsert ${type.toLowerCase()}s field`,
    description: `Upsert a(n) ${type.toLowerCase()}s field`,
    tags: ['fields'],
    security: [{ Bearer: [] }],
    requestBody: {
      ...generateJSONBase(generateFieldSchema(true)),
    },
    responses: {
      200: generateResponseSchema(generateFieldSchema(false)),
      400: generateErrorResponseSchema({
        description: 'Bad Request',
        errors: [
          {
            title: 'Unable to update field type when its in use',
          },
        ],
      }),
    },
  };
}

export function generateRemoveField<T extends ParentResourceType>(type: T) {
  return {
    operationId: `remove${type}sField` as const,
    summary: `Remove ${type.toLowerCase()} field`,
    description: `Remove a(n) ${type.toLowerCase()} field`,
    tags: ['fields'],
    security: [{ Bearer: [] }],
    parameters: [parameters.fieldId],
    responses: {
      200: generateResponseSchema({}),
      404: responses.notFound.generate('Field'),
    },
  };
}
