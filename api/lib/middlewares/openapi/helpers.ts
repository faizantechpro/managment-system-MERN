import { OpenAPIV3 } from 'openapi-types';
import { defaultResponses, responses } from './schemas/responses';
import { OpenAPIDoc } from './types';

function propertiesMap(props: OpenAPIV3.SchemaObject['properties']) {
  Object.values(props || {}).forEach((schema) => {
    if ('$ref' in schema) {
      return;
    }
    schemaCorrect(schema);
  });
}
function schemaCorrect(schema: OpenAPIV3.SchemaObject) {
  if ('properties' in schema) {
    propertiesMap(schema.properties);
  }
  if (
    'items' in schema &&
    Array.isArray(schema.items) &&
    schema.items.length === 1 &&
    schema.minItems
  ) {
    schema.items = schema.items[0];
  }

  const arrayKeys = ['anyOf', 'allOf', 'oneOf', 'items'];
  arrayKeys.forEach((key) => {
    if ((schema as any)[key] && Array.isArray((schema as any)[key])) {
      (schema as any)[key].forEach((schema: any) => schemaCorrect(schema));
    }
  });
}

export function appendDefaultsToDocs(apiDoc: OpenAPIV3.Document, ui = false) {
  if (ui) {
    propertiesMap(apiDoc.components?.schemas);
    (apiDoc.components!.schemas!.AnalyticDateRange as any) = {
      title: 'AnalyticDateRange',
      oneOf: [
        {
          items: {
            type: 'string',
            format: 'date-time',
          },
          minItems: 2,
          maxItems: 2,
          type: 'array',
        },
        {
          $ref: '#/components/schemas/AnalyticRelativeTimeRange',
        },
      ],
    };
  }

  Object.entries(apiDoc.paths).forEach(([path, methods]) => {
    Object.entries(methods || {}).forEach(([method, openAPIOperation]) => {
      const methods = ['post', 'put', 'delete', 'get', 'patch'];
      const m = method as typeof methods[number];

      if (typeof openAPIOperation === 'string') {
        return;
      }

      if (methods.includes(m) && 'responses' in openAPIOperation) {
        const doc = openAPIOperation as OpenAPIDoc;

        Object.keys(doc.responses).forEach((statusCode) => {
          doc.responses = {
            ...defaultResponses,
            ...doc.responses,
          };
          doc.responses[statusCode] = {
            ...doc.responses[statusCode],
            ...{ headers: {} },
          };
        });

        const isAuthn = !!doc.security?.length;
        if (isAuthn) {
          doc.responses[responses.unauthenticated.code] =
            responses.unauthenticated.schema;
        }

        const isAuthz = !!doc['x-authz'];
        if (isAuthz) {
          doc.responses[responses.unauthorized.code] =
            responses.unauthorized.schema;
        }
      }
    });
  });

  return apiDoc;
}
