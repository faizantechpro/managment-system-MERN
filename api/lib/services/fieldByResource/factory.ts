import { UserContext } from 'lib/middlewares/openapi';
import { ContactFieldService } from './Contact';
import { OrganizationFieldService } from './Organization';

type Field = 'contact' | 'organization';

export function fieldByResourceFactory(user: UserContext, type: Field) {
  if (type === 'contact') {
    return new ContactFieldService(user);
  } else if (type === 'organization') {
    return new OrganizationFieldService(user);
  }

  throw new Error('unknown field type');
}
