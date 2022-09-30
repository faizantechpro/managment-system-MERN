import { ContactField } from 'lib/database';
import { ContactFieldModel } from 'lib/database/models/contactsField';
import { UserContext } from 'lib/middlewares/openapi';
import { FieldByResource } from './FieldByResource';

export class ContactFieldService extends FieldByResource<
  'contact_id',
  ContactFieldModel
> {
  constructor(user: UserContext) {
    super(ContactField, user, 'contact_id');
  }
}
