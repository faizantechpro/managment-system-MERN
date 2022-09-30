import { ExpandModel } from 'lib/database/helpers';
import {
  ParentResourceType,
  generateGetFieldsByResource,
  generateUpsertFieldByResource,
  generateRemoveFieldByResource,
  generateGetFieldByResource,
  isGenericOpenAPIRequest,
  operationMiddleware,
} from 'lib/middlewares/openapi';
import {
  ContactFieldService,
  FieldByResourceModel,
  OrganizationFieldService,
  fieldFactory,
} from 'lib/services';
import { APIRequest } from '../operation';
import { fieldMappings } from './field';

// Deals do not use fields (at least not yet...)
type FieldParentResourceType = Exclude<ParentResourceType, 'Deal'>;

type Clazz = ContactFieldService | OrganizationFieldService;

const isContactRequest = isGenericOpenAPIRequest(
  'getContactFields',
  'getContactField',
  'upsertContactField',
  'removeContactField'
);
const isOrganizationRequest = isGenericOpenAPIRequest(
  'getOrganizationFields',
  'getOrganizationField',
  'upsertOrganizationField',
  'removeOrganizationField'
);

function extractGenericParams(req: APIRequest) {
  const { user } = req;

  // only added for types... need to find a better way
  if (!user) {
    throw new Error('no authentication provided');
  }

  let resourceId: string | undefined;
  let clazz: Clazz | undefined;

  if (isContactRequest(req)) {
    clazz = new ContactFieldService(user);
    resourceId = req.params.contact_id;
  } else if (isOrganizationRequest(req)) {
    clazz = new OrganizationFieldService(user);
    resourceId = req.params.organization_id;
  }

  if (!clazz || !resourceId) {
    throw new Error('invalid resource');
  }
  return {
    clazz,
    resourceId,
  };
}

function fieldValueToValue(
  field: ReturnType<
    ExpandModel<
      FieldByResourceModel<`${Lowercase<FieldParentResourceType>}_id`>
    >['toJSON']
  >
) {
  if (typeof field.value_boolean === 'boolean') {
    return field.value_boolean;
  } else if (field.value_char) {
    return field.value_char.trim();
  } else if (field.value_date instanceof Date) {
    return field.value_date.toISOString();
  } else if (typeof field.value_number === 'number') {
    return field.value_number;
  } else if (field.value_text) {
    return field.value_text;
  }

  throw new Error('unknown value set');
}

export const getAllFieldsByResource = (type: FieldParentResourceType) => {
  const opId = `get${type}Fields` as const;
  const op = operationMiddleware(
    opId,
    generateGetFieldsByResource(type),

    async (req, res) => {
      const {
        query: { limit, page, ...rest },
      } = req;

      const { resourceId, clazz } = extractGenericParams(req);
      const fields = await clazz.getFields(resourceId, { limit, page }, rest);

      return res.success({
        pagination: fields.pagination,
        data: fields.data.map((field) => ({
          ...field,
          value: fieldValueToValue(field),
        })) as any, // TODO fix this, spread breaks type
      });
    }
  );

  return op;
};

export const getFieldByResource = (type: FieldParentResourceType) => {
  const opId = `get${type}Field` as const;
  const op = operationMiddleware(
    opId,
    generateGetFieldByResource(type),

    async (req, res) => {
      const {
        params: { field_id },
      } = req;

      const { resourceId, clazz } = extractGenericParams(req);
      const field = await clazz.getOne(field_id, resourceId);
      if (!field) {
        return res.error(404, { error: 'Field not found' });
      }

      return res.success(
        {
          ...field,
          value: fieldValueToValue(field),
        } as any // TODO need to fix this, spread breaks typing
      );
    }
  );

  return op;
};

export const upsertFieldByResource = (type: FieldParentResourceType) => {
  const opId = `upsert${type}Field` as const;
  const op = operationMiddleware(
    opId,
    generateUpsertFieldByResource(type),

    async (req, res) => {
      const { body } = req;

      const fieldService = fieldFactory(
        req.user,
        type.toLowerCase() as Lowercase<FieldParentResourceType>
      );
      const fieldOpts = await fieldService.getOne(body.field_id);
      if (!fieldOpts) {
        return res.error(404, { error: 'Field not found' });
      }

      const mapping = fieldMappings[fieldOpts.field_type];
      if (!mapping.isValid(body.value)) {
        return res.error(400, {
          error: 'Invalid value provided for specified field',
        });
      }

      const { resourceId, clazz } = extractGenericParams(req);

      // TODO proper validation here..

      const field = await clazz.upsert(resourceId, {
        ...body,
        [mapping.db_field]: body.value,
      });

      return res.success({
        ...field,
        value: fieldValueToValue(field),
      });
    }
  );

  return op;
};

export const removeFieldByResource = (type: FieldParentResourceType) => {
  const opId = `remove${type}Field` as const;
  const op = operationMiddleware(
    opId,
    generateRemoveFieldByResource(type),

    async (req, res) => {
      const {
        params: { field_id },
      } = req;

      const { resourceId, clazz } = extractGenericParams(req);

      const field = await clazz.getOne(field_id, resourceId);
      if (!field) {
        return res.error(404, { error: 'Field not found' });
      }

      await clazz.remove(field_id, resourceId);

      return res.success({});
    }
  );

  return op;
};
