import { OrganizationFollowers } from 'lib/database';
import { OrganizationFollowersModel } from 'lib/database/models/organizationsFollowers';
import { UserContext } from 'lib/middlewares/openapi';
import { Follower } from './Follower';

export class OrganizationFollowerService extends Follower<
  'organization_id',
  OrganizationFollowersModel
> {
  constructor(user: UserContext) {
    super(OrganizationFollowers, user, 'organization_id');
  }
}
