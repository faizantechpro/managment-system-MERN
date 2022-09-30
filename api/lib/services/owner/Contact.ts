import { ContactOwners } from 'lib/database';
import { ContactOwnersModel } from 'lib/database/models/contactsOwners';
import { AuthUser } from 'lib/middlewares/auth';
import { Owner } from './Owner';

export class ContactOwnerService extends Owner<
  'contact_id',
  ContactOwnersModel
> {
  constructor(user: AuthUser) {
    super(ContactOwners, user, 'contact_id');
  }
}
