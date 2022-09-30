import {
  dealProductServiceFactory,
  dealServiceFactory,
} from 'lib/services/deal';
import {
  contactServiceFactory,
  feedServiceFactory,
  organizationServiceFactory,
} from 'lib/services';
import { AuthUser } from './auth';
import { Forbidden } from './exception';

interface IPrincipalOwnerValidator {
  user: AuthUser;
  id: string;
}

export const principalOwnerValidator = async ({
  user,
  id,
}: IPrincipalOwnerValidator) => {
  const service = dealServiceFactory(user);

  const currentDeal = await service.getDealById(id);

  const currentAssignedUser = currentDeal?.deal?.assigned_user_id;

  if (currentAssignedUser !== user?.id) {
    throw new Forbidden('Unauthorized');
  }
};

export const contactPrincipalOwnerValidator = async ({
  user,
  id,
}: IPrincipalOwnerValidator) => {
  const contactService = contactServiceFactory(user);
  const contact = await contactService.getContactById(id);

  const currentAssignedUser = contact?.assigned_user_id;

  if (!contact || currentAssignedUser !== user?.id) {
    throw new Forbidden('Unauthorized');
  }
};

export const organizationPrincipalOwnerValidator = async ({
  user: loggedUser,
  id,
}: IPrincipalOwnerValidator) => {
  const organizationService = organizationServiceFactory(loggedUser);
  const organization = await organizationService.getOrganizationById(id);

  const currentAssignedUser = organization?.assigned_user_id;

  if (!organization || currentAssignedUser !== loggedUser?.id) {
    throw new Forbidden('Unauthorized');
  }
};

export const dealProductValidator = async ({
  user,
  id,
}: IPrincipalOwnerValidator) => {
  const service = dealProductServiceFactory(user);

  const dealProduct = await service.getOne(id);

  const { deal_id } = dealProduct || {};

  if (deal_id) {
    return principalOwnerValidator({ user, id: deal_id });
  }

  throw new Forbidden('Unauthorized');
};

export const feedValidator = async ({ user, id }: IPrincipalOwnerValidator) => {
  const service = feedServiceFactory(user);
  const feed = await service.getOne(id);

  const { created_by } = feed || {};

  if (created_by !== user?.id) {
    throw new Forbidden('Unauthorized');
  }
};
