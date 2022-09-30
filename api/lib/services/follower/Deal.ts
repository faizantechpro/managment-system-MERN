import { DealFollowers } from 'lib/database';
import { DealFollowersModel } from 'lib/database/models/deal';
import { UserContext } from 'lib/middlewares/openapi';
import { Follower } from './Follower';

export class DealFollowerService extends Follower<
  'deal_id',
  DealFollowersModel
> {
  constructor(user: UserContext) {
    super(DealFollowers, user, 'deal_id');
  }
}
