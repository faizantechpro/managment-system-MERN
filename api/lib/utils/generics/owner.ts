import {
  generateAddOwner,
  generateGetOwners,
  generateRemoveOwner,
  isGenericOpenAPIRequest,
  operationMiddleware,
  ParentResourceType,
} from 'lib/middlewares/openapi';
import {
  ContactOwnerService,
  DealOwnerService,
  OrganizationOwnerService,
  contactServiceFactory,
  organizationServiceFactory,
  dealServiceFactory,
} from 'lib/services';
import { emitAppEvent } from 'lib/middlewares/emitter';
import { AuthorizationService } from 'lib/services/authorization';
import { APIRequest } from '../operation';

type Clazz =
  | ContactOwnerService
  | DealOwnerService
  | OrganizationOwnerService
  | undefined;
type Service =
  | ReturnType<typeof contactServiceFactory>
  | ReturnType<typeof dealServiceFactory>
  | ReturnType<typeof organizationServiceFactory>;

const isContactRequest = isGenericOpenAPIRequest(
  'getContactOwners',
  'addContactOwner',
  'removeContactOwner'
);
const isDealRequest = isGenericOpenAPIRequest(
  'getDealOwners',
  'addDealOwner',
  'removeDealOwner'
);
const isOrganizationRequest = isGenericOpenAPIRequest(
  'getOrganizationOwners',
  'addOrganizationOwner',
  'removeOrganizationOwner'
);

function extractGenericParams(req: APIRequest) {
  const { user } = req;

  // only added for types... need to find a better way
  if (!user) {
    throw new Error('no authentication provided');
  }

  let resourceId: string | undefined;
  let clazz: Clazz;
  let service: Service | undefined;

  if (isContactRequest(req)) {
    clazz = new ContactOwnerService(user);
    service = contactServiceFactory(user);
    resourceId = req.params.contact_id;
  } else if (isDealRequest(req)) {
    clazz = new DealOwnerService(user);
    service = dealServiceFactory(user);
    resourceId = req.params.deal_id;
  } else if (isOrganizationRequest(req)) {
    clazz = new OrganizationOwnerService(user);
    service = organizationServiceFactory(user);
    resourceId = req.params.organization_id;
  }

  if (!clazz || !resourceId || !service) {
    throw new Error('invalid resource');
  }
  return {
    clazz,
    service,
    resourceId,
  };
}

export const getAllOwners = (type: ParentResourceType) => {
  const opId = `get${type}Owners` as const;
  const op = operationMiddleware(
    opId,
    generateGetOwners(type),

    async (req, res) => {
      const {
        query: { limit, page, ...rest },
      } = req;

      const { resourceId, clazz } = extractGenericParams(req);
      const owners = await clazz.getOwners(resourceId, { limit, page }, rest);

      return res.success(owners);
    }
  );

  return op;
};

export const addOwner = (type: ParentResourceType) => {
  const opId = `add${type}Owner` as const;
  const op = operationMiddleware(
    opId,
    generateAddOwner(type),

    async (req, res) => {
      const {
        params: { user_id },
        user,
      } = req;

      const { resourceId, clazz, service } = extractGenericParams(req);
      const isOwner = await service.validatePrimaryOwner(resourceId);

      if (!isOwner) {
        AuthorizationService.isAdmin(user);
      }

      const newOwner = await clazz.addOwner(resourceId, user_id);

      await emitAppEvent({
        event: 'OWNER_ADDED',
        resource: `${type.toLowerCase()}` as Lowercase<ParentResourceType>,
        resource_id: resourceId,
        payload: {
          user_id,
          tenant_id: user.tenant,
        },
      });

      return res.success(newOwner);
    }
  );

  return op;
};

export const removeOwner = (type: ParentResourceType) => {
  const opId = `remove${type}Owner` as const;
  const op = operationMiddleware(
    opId,
    generateRemoveOwner(type),

    async (req, res) => {
      const {
        params: { user_id },
        user,
      } = req;

      const { resourceId, clazz, service } = extractGenericParams(req);
      const isOwner = await service.validatePrimaryOwner(resourceId);

      if (!isOwner) {
        AuthorizationService.isAdmin(user);
      }

      const owner = await clazz.getOwner(resourceId, user_id);
      if (!owner) {
        return res.error(404, { error: 'Owner not found' });
      }

      await clazz.deleteOwner(resourceId, user_id);

      return res.success({});
    }
  );

  return op;
};
