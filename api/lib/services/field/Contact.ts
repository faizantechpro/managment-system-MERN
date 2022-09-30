import { Field as FieldDb } from 'lib/database';
import { FieldStatic } from 'lib/database/models/field';
import { UserContext } from 'lib/middlewares/openapi';
import { Field } from './Field';

export class ContactsFieldService extends Field<'contact'> {
  constructor(user: UserContext) {
    super(FieldDb as FieldStatic<'contact'>, user, 'contact');
  }
}
