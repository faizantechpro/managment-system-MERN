import { DealOwners } from 'lib/database';
import { DealOwnersModel } from 'lib/database/models/deal';
import { AuthUser } from 'lib/middlewares/auth';
import { Owner } from './Owner';

export class DealOwnerService extends Owner<'deal_id', DealOwnersModel> {
  constructor(user: AuthUser) {
    super(DealOwners, user, 'deal_id');
  }
}
