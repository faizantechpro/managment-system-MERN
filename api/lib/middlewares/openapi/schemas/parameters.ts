import { OpenAPIV3 } from 'openapi-types';
import { apiSchemas } from '../types';

export function generateBulkQueryParam(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
): OpenAPIV3.ParameterObject[] {
  if ('$ref' in schema) {
    const schemaReference = schema.$ref.split('/').pop()!;
    return generateBulkQueryParam(
      apiSchemas[schemaReference as keyof typeof apiSchemas]
    );
  }

  if (schema.allOf) {
    return schema.allOf.reduce((acc, item) => {
      return [...acc, ...generateBulkQueryParam(item)];
    }, [] as OpenAPIV3.ParameterObject[]);
  }

  if (!schema.properties) {
    return [];
  }

  return Object.entries(schema.properties).map(([property, schema]) => {
    return generateQueryParam(
      property,
      false,
      schema as OpenAPIV3.SchemaObject
    );
  });
}

export function generateQueryParam(
  name: string,
  required: boolean,
  schema: OpenAPIV3.SchemaObject
) {
  return generateParameter('query', {
    name,
    required,
    schema,
  });
}

function generatePathParamNumber(name: string) {
  return generatePathParam(name, {
    type: 'number',
  });
}
function generatePathParamUUID(name: string) {
  return generatePathParam(name, {
    type: 'string',
    format: 'uuid',
  });
}

function generatePathParam(
  name: string,
  schema: OpenAPIV3.SchemaObject,
  required = true
) {
  return generateParameter('path', {
    name,
    required,
    schema,
  });
}

function generateParameter(
  type: 'query' | 'path',
  parameter: {
    name: string;
    required: boolean;
    schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  }
): OpenAPIV3.ParameterObject {
  return {
    in: type,
    ...parameter,
  } as OpenAPIV3.ParameterObject;
}

export const parameters = {
  // number params
  categoryId: generatePathParamNumber('categoryId'),

  // uuids
  analyticId: generatePathParamUUID('analyticId'),
  avatarId: generatePathParamUUID('avatar_id'),
  badgeId: generatePathParamUUID('badgeId'),
  componentId: generatePathParamUUID('componentId'),
  contactId: generatePathParamUUID('contact_id'),
  courseId: generatePathParamUUID('course_id'),
  dashboardId: generatePathParamUUID('dashboardId'),
  dealId: generatePathParamUUID('deal_id'),
  fieldId: generatePathParamUUID('field_id'),
  groupId: generatePathParamUUID('groupId'),
  insightId: generatePathParamUUID('insight_id'),
  organizationId: generatePathParamUUID('organization_id'),
  quizId: generatePathParamUUID('quiz_id'),
  reportId: generatePathParamUUID('report_id'),
  roleId: generatePathParamUUID('roleId'),
  submissionId: generatePathParamUUID('submission_id'),
  teamId: generatePathParamUUID('teamId'),
  tenantId: generatePathParamUUID('tenant_id'),

  // custom
  domain: generatePathParam('domain', {
    type: 'string',
  }),
  integrationType: generatePathParam('type', {
    type: 'string',
    enum: ['FISERV'],
  }),
  naicsCode: generatePathParam('code', {
    type: 'string',
    pattern: '\\d+',
  }),
  siteId: generatePathParam('site_id', {
    type: 'string',
  }),
  userId: generatePathParam('user_id', {
    oneOf: [
      {
        type: 'string',
        format: 'uuid',
      },
      {
        type: 'string',
        enum: ['self'],
      },
    ],
  }),
};
