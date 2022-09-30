import { OpenAPIV3 } from 'openapi-types';

export function generateRequestBody(
  requestSchema: OpenAPIV3.SchemaObject
): OpenAPIV3.RequestBodyObject {
  return {
    required: true,
    ...generateJSONBase(requestSchema),
  };
}

export function generateJSONBase(
  requestSchema: OpenAPIV3.SchemaObject
): OpenAPIV3.RequestBodyObject {
  return {
    content: {
      'application/json': {
        schema: requestSchema,
      },
    },
  };
}

export function appendSchemaToAllOf(
  baseSchema: OpenAPIV3.SchemaObject,
  schemaToAppend: OpenAPIV3.SchemaObject
): OpenAPIV3.SchemaObject {
  const appendedSchema = JSON.parse(JSON.stringify(baseSchema));

  if (!appendedSchema.allOf) {
    appendedSchema.allOf = [];
  }

  appendedSchema.allOf.push(schemaToAppend);

  return appendedSchema;
}
