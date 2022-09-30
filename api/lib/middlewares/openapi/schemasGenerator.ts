import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-types';
import { getOpenApiWriter, getTypeScriptReader, makeConverter } from 'typeconv';
import {
  analyticDisplayTypes,
  analyticTypes,
  labelTypes,
  userStatuses,
} from '../sequelize/models';

(async () => {
  const dbFile = fs.readFileSync('lib/middlewares/sequelize/types.ts', 'utf-8');
  const contents = readFiles('lib/middlewares/sequelize/models');
  const allTypes = [dbFile, contents].join('\n');

  const reader = getTypeScriptReader();
  const writer = getOpenApiWriter({
    format: 'ts',
    title: 'Model Definitions',
    version: '1.0.0',
    schemaVersion: '3.0.3',
  });
  const { convert } = makeConverter(reader, writer);
  const { data } = await convert({ data: allTypes });
  const parsedData = fixTypes(JSON.parse(data));

  const openAPIPath = 'lib/middlewares/openapi/schemas.gen.json';
  fs.writeFileSync(openAPIPath, JSON.stringify(parsedData, null, 2));
})();

function readFiles(dir: string) {
  const files = fs.readdirSync(dir);
  const contents = files.map((file) => {
    return fs.readFileSync(path.resolve(dir, file), 'utf-8');
  });

  return contents.join('\n');
}

function fixTypes(data: {
  components: { schemas: { [K in string]: OpenAPIV3.SchemaObject } };
}) {
  // need to find and delete all titles that have $ref member
  const propertiesCorrect = (props: OpenAPIV3.SchemaObject['properties']) => {
    Object.values(props || {}).forEach((schema) => {
      schemaCorrect(schema as any);
    });
  };

  const schemaCorrect = (schema: OpenAPIV3.SchemaObject) => {
    if ('$ref' in schema && (schema as any).title) {
      delete (schema as any).title;
    }
    // causes issues with oneOf and anyOf...
    if (typeof schema.additionalProperties === 'boolean') {
      delete schema.additionalProperties;
    }
    if (Object.keys(schema).includes('additionalItems')) {
      delete (schema as any).additionalItems;
    }
    if ('description' in schema && schema.description) {
      const attrs = schema.description.split('\n');
      const descriptions = attrs
        .map((attr) => {
          const attrReg = new RegExp(/(\s)?@\w+ [^\s]+/);
          const attrMatch = attrReg.exec(attr);
          if (attrMatch) {
            const [attr, attrValue] = attrMatch[0].split(' ');
            const attrName = attr.replace(/@|\n/, '');

            schema[attrName] = Number.isNaN(Number(attrValue))
              ? attrValue
              : Number(attrValue);
            return '';
          }
          return attr;
        })
        .filter((str) => !!str);
      schema.description = descriptions.join('\n');

      if (!schema.description) {
        delete schema.description;
      }
    }

    if ('properties' in schema && schema.properties) {
      propertiesCorrect(
        schema.properties as OpenAPIV3.SchemaObject['properties']
      );
    }
    if ('anyOf' in schema && schema.anyOf) {
      schema.anyOf.forEach((schema) => {
        schemaCorrect(schema as OpenAPIV3.SchemaObject);
      });
      // anyOf causes types to be generated with partial
      schema.oneOf = schema.anyOf;
      delete schema.anyOf;
    }
    if ('allOf' in schema && schema.allOf) {
      if (schema.allOf.length === 0) {
        delete schema.allOf;
      } else {
        schema.allOf.forEach((schema) => {
          schemaCorrect(schema as OpenAPIV3.SchemaObject);
        });
      }
    }
    if ('oneOf' in schema && schema.oneOf) {
      schema.oneOf.forEach((schema) => {
        if ('title' in schema) {
          delete schema.title;
        }
        schemaCorrect(schema as OpenAPIV3.SchemaObject);
      });
    }
    if ('items' in schema && schema.items) {
      if (!Array.isArray(schema.items)) {
        schemaCorrect(schema.items as any);
      } else {
        schema.items.forEach((item) => {
          schemaCorrect(item);
        });
      }
    }

    /**
     * Special cases
     */
    if ('oneOf' in schema && schema.oneOf) {
      // can't have minItems = 0, invalid :(
      const idxs = schema.oneOf
        .filter(
          (oneOf) =>
            (oneOf as any).minItems === 0 &&
            schema.title !== 'AnalyticTimeDimension' // skip time dimension
        )
        .map((oneOf, idx) => idx);
      idxs.forEach((idx, i) => {
        schema.oneOf?.splice(idx - i, 1);
      });
    }
  };

  const removeProperties = (
    schema: OpenAPIV3.SchemaObject,
    keys: string[] | 'ALL'
  ) => {
    const schemaFix = (
      entry: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
    ) => {
      if ('properties' in entry && entry.properties && Array.isArray(keys)) {
        keys.forEach((key) => delete (entry.properties as any)[key]);
      }
      if ('required' in entry && entry.required) {
        entry.required = entry.required.filter(
          (require) => !keys.includes(require)
        );
      }
    };

    if ('allOf' in schema && schema.allOf) {
      schema.allOf.forEach((entry) => {
        schemaFix(entry);
      });
      schema.allOf = schema.allOf.filter((entry) => {
        if (!('$ref' in entry) || !entry['$ref'] || !Array.isArray(keys)) {
          return true;
        }
        return !keys.some((key) => entry['$ref'].endsWith(key));
      });
    } else if ('properties' in schema && schema.properties) {
      schemaFix(schema);
    }
    return schema;
  };
  const makeOptional = (
    schema: OpenAPIV3.SchemaObject,
    keys: string[] | 'ALL'
  ) => {
    if ('properties' in schema && schema.properties && schema.required) {
      schema.required = schema.required.filter(
        (require) => keys !== 'ALL' && !keys.includes(require)
      );
    }
    if ('allOf' in schema && schema.allOf) {
      schema.allOf.forEach((entry) => {
        if ('required' in entry && entry.required) {
          entry.required = entry.required.filter(
            (require) => keys !== 'ALL' && !keys.includes(require)
          );
        }
      });
    }

    return schema;
  };
  /**
   * Clones the provided source and writes the output of the provided function
   * to the target.
   */
  const cloneAndExecute = (
    target: OpenAPIV3.SchemaObject,
    source: OpenAPIV3.SchemaObject,
    keys: string[] | 'ALL',
    fn: (
      schema: OpenAPIV3.SchemaObject,
      keys: string[] | 'ALL'
    ) => OpenAPIV3.SchemaObject
  ) => {
    if (source.allOf) {
      target.allOf = (target.allOf || []).concat(
        JSON.parse(JSON.stringify(source.allOf))
      );
      delete (target as any)['$ref'];
    } else if (source.properties) {
      target.properties = {
        ...target.properties,
        ...JSON.parse(JSON.stringify(source.properties)),
      };
      target.required = [
        ...new Set((target.required || []).concat(...(source.required || []))),
      ];
      delete (target as any)['$ref'];
    }
    return fn(target, keys);
  };

  const joinSchemas = (
    parent: OpenAPIV3.SchemaObject,
    childSchemas: (
      | {
          name: string;
          property: string;
          type: 'object' | 'array';
          required: boolean;
          schema?: OpenAPIV3.SchemaObject;
        }
      | OpenAPIV3.SchemaObject
    )[]
  ) => {
    let joined = JSON.parse(JSON.stringify(parent));

    if (!joined.allOf) {
      joined = {
        allOf: [
          {
            ...joined,
          },
        ],
      };
    }

    childSchemas.forEach((child) => {
      let schema;
      // raw schema
      if ('name' in child) {
        const innerSchema = child.schema
          ? child.schema
          : {
              $ref: `#/components/schemas/${child.name}`,
            };

        if (child.type === 'object') {
          schema = {
            type: 'object',
            properties: {
              [child.property]: innerSchema,
            },
          };
        } else if (child.type === 'array') {
          schema = {
            type: 'object',
            properties: {
              [child.property]: {
                type: 'array',
                items: innerSchema,
              },
            },
          };
        }

        if (schema && child.required) {
          schema.required = [child.property];
        }
      }
      if ('properties' in child) {
        schema = child;
      }

      if (schema) {
        joined.allOf!.push(schema);
      }
    });

    return joined as OpenAPIV3.SchemaObject;
  };

  const schemas = data.components.schemas;

  /**
   * The following is to fix types that are not properly converted from
   * typescript (typeconv) to OpenAPI schema. This mainly occurs when using
   * type util functions or generics with types.
   */

  (schemas.AnalyticDateRange as any).anyOf[0].maxItems = 2;
  (schemas.AnalyticDateRange as any).anyOf[0].items[0].format = 'date-time';
  (schemas.AnalyticDateRange as any).anyOf[0].items[1].format = 'date-time';

  (schemas.AnalyticFilter as any) = {
    title: 'AnalyticFilter',
    type: 'array',
    items: {
      oneOf: [
        {
          type: 'object',
          required: ['member', 'values', 'operator'],
          properties: {
            member: {
              type: 'string',
            },
            values: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            operator: {
              type: 'string',
              enum: [
                'equals',
                'notEquals',
                'contains',
                'notContains',
                'startsWith',
                'endsWith',
                'gt',
                'gte',
                'lt',
                'lte',
              ],
            },
          },
        },
        {
          type: 'object',
          required: ['member', 'operator'],
          properties: {
            member: {
              type: 'string',
            },
            operator: {
              type: 'string',
              enum: ['set', 'notSet'],
            },
          },
        },
      ],
    },
  };

  (schemas.AnalyticAttr as any).allOf[0].properties.filters = {
    $ref: '#/components/schemas/AnalyticFilter',
  };

  (schemas.AnalyticOrder as any).items.maxItems = 2;

  const AnalyticRelativeTimeRange = {
    ...(schemas.AnalyticRelativeTimeRange as any),
  };
  (schemas.AnalyticRelativeTimeRange as any) = {
    title: 'AnalyticRelativeTimeRange',
    oneOf: [
      {
        type: 'string',
        enum: [
          'this year',
          'this month',
          'this week',
          ...AnalyticRelativeTimeRange.enum,
          'last week',
          'last month',
          'last year',
        ],
      },
      {
        type: 'string',
        pattern: 'last \\d+ (day|month|year)',
      },
      {
        type: 'string',
        pattern: 'from \\d+ (day|month|year) ago to now',
      },
    ],
  };

  (schemas.AnalyticTimeDimension as any).anyOf[0] = {
    items: {},
    type: 'array',
  };
  (
    schemas.AnalyticTimeDimension as any
  ).anyOf[2].items[0].properties.compareDateRange.maxItems = 2;

  // maybe this should be remove properties??
  (
    schemas.ComponentCreateWithAnalyticBiz as any
  ).anyOf[1].properties.component = {
    properties: {
      name: {
        title: 'name',
        type: 'string',
      },
    },
    required: ['name'],
    type: 'object',
  };

  (schemas.Date as any) = {
    type: 'string',
    format: 'date-time',
    description: 'ISO date time',
    example: '2006-01-02T15:04:05.000Z',
  };

  /**
   * The following is quick manual fixes for types that were not converted
   * as expected.
   */

  function convertToEnum(
    schema: OpenAPIV3.SchemaObject,
    keys: readonly string[],
    makeNullable = false
  ) {
    schema.type = 'string';
    schema.enum = [...keys];
    if (makeNullable) {
      schema.nullable = true;
    }
  }
  convertToEnum(schemas.AnalyticType, analyticTypes);
  convertToEnum(schemas.LabelType, labelTypes, true);
  convertToEnum(schemas.AnalyticDisplayType, analyticDisplayTypes);
  convertToEnum(schemas.UserStatus, userStatuses);

  /**
   * Manual fixes...
   */

  const defaultKeysToRemove = [
    'id',
    'createdById',
    'tenantId',
    'tenant_id',
    'Timestamp', // ref
    'ModelTimestamp', // ref
    'deletedAt',
    'deleted',
  ];

  cloneAndExecute(
    schemas.AnalyticCreateBiz as any,
    schemas.AnalyticAttr,
    defaultKeysToRemove,
    removeProperties
  );
  cloneAndExecute(
    schemas.AnalyticCreateBiz as any,
    schemas.AnalyticCreateBiz,
    [
      'isMulti',
      'dimensions',
      'filters',
      'limit',
      'measures',
      'order',
      'segments',
      'timeDimensions',
    ],
    makeOptional
  );
  cloneAndExecute(
    schemas.AnalyticModifyBiz as any,
    schemas.AnalyticCreateBiz,
    'ALL',
    makeOptional
  );

  cloneAndExecute(
    schemas.ComponentCreateBiz as any,
    schemas.ComponentAttr,
    defaultKeysToRemove,
    removeProperties
  );
  cloneAndExecute(
    schemas.DashboardCreateBiz as any,
    schemas.DashboardAttr,
    defaultKeysToRemove,
    removeProperties
  );
  cloneAndExecute(
    schemas.BadgeModifyBiz as any,
    schemas.BadgeAttr,
    defaultKeysToRemove.concat('deleted'),
    removeProperties
  );
  cloneAndExecute(
    schemas.GroupModifyBiz as any,
    cloneAndExecute(
      schemas.GroupModifyBiz as any,
      schemas.GroupCreateBiz,
      ['parent_id'],
      removeProperties
    ),
    'ALL',
    makeOptional
  );
  cloneAndExecute(
    schemas.LabelCreateBiz as any,
    schemas.LabelAttr,
    defaultKeysToRemove.concat('assigned_user_id'),
    removeProperties
  );
  cloneAndExecute(
    schemas.LabelModifyBiz as any,
    schemas.LabelCreateBiz,
    ['name', 'color', 'type'],
    makeOptional
  );

  cloneAndExecute(
    schemas.TeamCreateBiz as any,
    cloneAndExecute(
      schemas.TeamCreateBiz as any,
      schemas.TeamAttr,
      defaultKeysToRemove.concat('members'),
      removeProperties
    ),
    ['isActive'],
    makeOptional
  );
  schemas.TeamCreateBiz = joinSchemas(schemas.TeamCreateBiz, [
    {
      type: 'object',
      required: ['members'],
      properties: {
        members: {
          type: 'array',
          items: cloneAndExecute(
            {},
            cloneAndExecute(
              {},
              schemas.TeamMemberAttr,
              defaultKeysToRemove.concat('teamId'),
              removeProperties
            ),
            ['isManager'],
            makeOptional
          ),
        },
      },
    },
  ]);
  cloneAndExecute(
    schemas.TeamModifyBiz as any,
    cloneAndExecute(
      schemas.TeamModifyBiz as any,
      schemas.TeamAttr,
      defaultKeysToRemove,
      removeProperties
    ),
    'ALL',
    makeOptional
  );

  cloneAndExecute(
    schemas.TeamMemberCreateBiz as any,
    cloneAndExecute(
      schemas.TeamMemberCreateBiz as any,
      schemas.TeamMemberAttr,
      defaultKeysToRemove.concat('teamId', 'userId'),
      removeProperties
    ),
    'ALL',
    makeOptional
  );

  /**
   * THe following modifications are for route specific queries, payloads,
   * and/or responses.
   *
   * Please use format of:
   * * <operationId> for response
   * * <operationIdQuery> for queries
   * * <operationIdPayload> for payloads
   */

  schemas.CreateTeam = joinSchemas(schemas.TeamAttr, [
    {
      type: 'object',
      required: ['members'],
      properties: {
        members: {
          type: 'array',
          items: schemas.TeamMemberAttr,
        },
      },
    },
  ]);
  schemas.GetTeamMembers = joinSchemas(schemas.TeamMemberAttr, [
    {
      type: 'object',
      required: ['user'],
      properties: {
        user: schemas.UserAttr,
      },
    },
  ]);

  schemas.GetCategory = joinSchemas(schemas.CategoryAttr, [
    {
      type: 'object',
      required: ['isPublic', 'totalCourses', 'totalLessons'],
      properties: {
        isPublic: {
          type: 'boolean',
        },
        totalCourses: {
          type: 'number',
        },
        totalLessons: {
          type: 'number',
        },
      },
    },
  ]);
  schemas.GetCourses = joinSchemas(schemas.CourseAttr, [
    {
      name: 'CategoryAttr',
      property: 'category',
      type: 'object',
      required: false,
    },
    {
      name: 'BadgeAttr',
      property: 'badge',
      type: 'object',
      required: false,
    },
    {
      name: 'QuizAttr',
      property: 'quiz',
      type: 'object',
      required: false,
    },
    {
      name: 'CourseProgressAttr',
      property: 'progress',
      type: 'array',
      required: false,
    },
    {
      type: 'object',
      required: ['totalLessons'],
      properties: {
        totalLessons: {
          type: 'number',
        },
      },
    },
  ]);
  schemas.GetDashboardComponents = joinSchemas(schemas.DashboardComponentAttr, [
    {
      name: 'schema', // for type narrowing
      property: 'component',
      type: 'object',
      required: true,
      schema: joinSchemas(schemas.ComponentAttr, [
        {
          name: 'AnalyticAttr',
          property: 'analytic',
          type: 'object',
          required: true,
        },
      ]),
    },
  ]);
  schemas.GetLessons = joinSchemas(schemas.LessonAttr, [
    {
      name: 'CategoryAttr',
      property: 'category',
      type: 'object',
      required: false,
    },
    {
      name: 'LessonProgressAttr',
      property: 'progress',
      type: 'array',
      required: false,
    },
  ]);
  schemas.GetUsers = joinSchemas(schemas.UserAttr, [
    {
      name: 'TenantAttr',
      property: 'tenant',
      type: 'object',
      required: true,
    },
    {
      name: 'RoleAttr',
      property: 'roleInfo',
      type: 'object',
      required: false,
    },
  ]);

  Object.values(data.components.schemas).forEach((schema) => {
    schemaCorrect(schema as OpenAPIV3.SchemaObject);
  });

  // want to keep anyOf here
  schemas.DashboardComponentModifiedBiz = {
    anyOf: [
      {
        type: 'object',
        properties: {
          component: {
            $ref: '#/components/schemas/ComponentAttr',
          },
        },
      },
      {
        ...schemas.DashboardComponentAttr,
      },
    ],
  };
  delete schemas.DashboardComponentModifiedBiz.allOf;

  return data;
}
