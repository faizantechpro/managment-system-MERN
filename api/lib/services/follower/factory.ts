import { UserContext } from 'lib/middlewares/openapi';
import { ContactFollowerService } from './Contact';
import { DealFollowerService } from './Deal';
import { OrganizationFollowerService } from './Organization';

type Follower = 'contact' | 'deal' | 'organization';

export function followerFactory(user: UserContext, type: Follower) {
  if (type === 'contact') {
    return new ContactFollowerService(user);
  } else if (type === 'deal') {
    return new DealFollowerService(user);
  } else if (type === 'organization') {
    return new OrganizationFollowerService(user);
  }

  throw new Error('unknown follower type');
}
