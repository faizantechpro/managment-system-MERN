import { OpenAPIV3 } from 'openapi-types';
import { generateJSONBase } from './helpers';
import { schemas } from './schemas';

export function generateResponseSchema(
  responseSchema: OpenAPIV3.SchemaObject,
  description?: string
) {
  return {
    description: description || 'Successful Response',
    ...generateJSONBase(responseSchema),
  };
}

export function generateEmptyResponseSchema(description?: string) {
  return generateResponseSchema(
    {
      type: 'object',
      properties: {},
    },
    description
  );
}

export function generatePaginatedResponseSchema(
  data: OpenAPIV3.SchemaObject,
  arrayKey = 'data'
) {
  return generateResponseSchema({
    type: 'object',
    required: ['pagination', arrayKey],
    properties: {
      pagination: schemas.paginationResponse,
      [arrayKey]: {
        type: 'array',
        items: data,
      },
    },
  });
}

export const responses = {
  badRequest: {
    code: 400,
    schema: generateResponseSchema(
      {
        type: 'object',
        required: ['error', 'errors'],
        properties: {
          error: {
            type: 'string',
            enum: ['Bad request'],
          },
          errors: {
            type: 'array',
            items: {
              description: 'List of all input validation errors',
              type: 'object',
              required: ['path', 'message', 'location'],
              properties: {
                path: {
                  description: 'Name of invalid key',
                  type: 'string',
                },
                error_code: {
                  description: 'Error code',
                  type: 'string',
                },
                message: {
                  description: 'Description of the invalid input',
                  type: 'string',
                },
                location: {
                  description: 'Location of invalid key',
                  type: 'string',
                },
              },
            },
          },
        },
      },
      'Bad request'
    ),
    generate: (...titles: [string, ...string[]]) => {
      return generateErrorResponseSchema({
        description: 'Bad request',
        errors: titles.map((title) => ({
          title,
        })) as [BaseError, ...BaseError[]],
      });
    },
  },

  unauthenticated: {
    code: 401,
    schema: generateResponseSchema(
      {
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            items: {
              description: 'List of all errors',
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  enum: ['No JWT provided'],
                },
                extensions: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'string',
                      enum: ['INVALID_CREDENTIALS'],
                    },
                  },
                },
              },
            },
          },
        },
      },
      'Unauthenticated'
    ),
  },

  unauthorized: {
    code: 403,
    schema: generateResponseSchema(
      {
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            items: {
              description: 'List of all errors',
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  enum: ["You don't have permission to access this."],
                },
                extensions: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'string',
                      enum: ['FORBIDDEN'],
                    },
                  },
                },
              },
            },
          },
        },
      },
      'Unauthorized'
    ),
  },

  notFound: {
    generate: (...resources: [string, ...string[]]) => {
      return generateErrorResponseSchema({
        description: 'Resource not found',
        errors: resources.map((resource) => ({
          title: `${resource} not found`,
        })) as [BaseError, ...BaseError[]],
      });
    },
  },
};

export const defaultResponses = {
  [responses.badRequest.code]: responses.badRequest.schema,
};

type BaseError = {
  title: string;
  description?: string;
};

export function generateErrorSchema(input: {
  description: string;
  errors: [BaseError, ...BaseError[]];
}): OpenAPIV3.SchemaObject {
  const errors = input.errors.map((error) => ({
    ...error,
    type: 'string' as const,
    enum: [error.title],
  }));

  return {
    description: input.description,
    type: 'object',
    required: ['error'],
    properties: {
      error: errors.length > 1 ? { oneOf: errors } : errors[0],
    },
  };
}

export function generateErrorResponseSchema(input: {
  description: string;
  errors: [BaseError, ...BaseError[]];
}): OpenAPIV3.ResponseObject {
  return {
    description: input.description,
    content: {
      'application/json': {
        schema: generateErrorSchema(input),
      },
    },
  };
}
