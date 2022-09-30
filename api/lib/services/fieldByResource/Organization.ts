import { OrganizationField } from 'lib/database';
import { OrganizationFieldModel } from 'lib/database/models/organizationsField';
import { UserContext } from 'lib/middlewares/openapi';
import { FieldByResource } from './FieldByResource';

export class OrganizationFieldService extends FieldByResource<
  'organization_id',
  OrganizationFieldModel
> {
  constructor(user: UserContext) {
    super(OrganizationField, user, 'organization_id');
  }
}
