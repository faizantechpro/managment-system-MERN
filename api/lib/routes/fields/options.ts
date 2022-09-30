import { fieldMappings, FieldType } from 'lib/utils/generics/field';
import {
  generateResponseSchema,
  operationMiddleware,
  parameters,
  schemas,
} from 'lib/middlewares/openapi';

export const GET = operationMiddleware(
  'getFieldOptions',
  {
    operationId: 'getFieldOptions',
    summary: 'Get Field Options',
    tags: ['fields'],
    security: [{ Bearer: [] }],
    parameters: [],
    responses: {
      200: generateResponseSchema({
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'description', 'field_type', 'value_type'],
          properties: {
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            field_type: schemas.fieldType,
            value_type: {
              type: 'string',
            },
          },
        },
      }),
    },
  },

  async (req, res) => {
    return res.success(
      Object.entries(fieldMappings).map(([fieldType, mapping]) => {
        return {
          name: mapping.name,
          description: mapping.description,
          field_type: fieldType as keyof typeof FieldType,
          value_type: mapping.value_type,
        };
      })
    );
  }
);
