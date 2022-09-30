import { AuthUser } from 'lib/middlewares/auth';
import { ContactOwnerService } from './Contact';
import { DealOwnerService } from './Deal';
import { OrganizationOwnerService } from './Organization';

type Owner = 'contact' | 'deal' | 'organization';

export function ownerFactory(user: AuthUser, type: Owner) {
  if (type === 'contact') {
    return new ContactOwnerService(user);
  } else if (type === 'deal') {
    return new DealOwnerService(user);
  } else if (type === 'organization') {
    return new OrganizationOwnerService(user);
  }

  throw new Error('unknown owner type');
}
