import { OrganizationOwners } from 'lib/database';
import { OrganizationOwnersModel } from 'lib/database/models/organizationsOwners';
import { AuthUser } from 'lib/middlewares/auth';
import { Owner } from './Owner';

export class OrganizationOwnerService extends Owner<
  'organization_id',
  OrganizationOwnersModel
> {
  constructor(user: AuthUser) {
    super(OrganizationOwners, user, 'organization_id');
  }
}
