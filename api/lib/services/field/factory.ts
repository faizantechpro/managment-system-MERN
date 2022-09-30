import { FieldResourceType } from 'lib/database/models/field';
import { UserContext } from 'lib/middlewares/openapi';
import { ContactsFieldService } from './Contact';
import { OrganizationsFieldService } from './Organization';

export function fieldFactory(user: UserContext, type: FieldResourceType) {
  if (type === 'contact') {
    return new ContactsFieldService(user);
  } else if (type === 'organization') {
    return new OrganizationsFieldService(user);
  }

  throw new Error('unknown field type');
}
