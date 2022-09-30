import { Field as FieldDb } from 'lib/database';
import { FieldStatic } from 'lib/database/models/field';
import { UserContext } from 'lib/middlewares/openapi';
import { Field } from './Field';

export class OrganizationsFieldService extends Field<'organization'> {
  constructor(user: UserContext) {
    super(FieldDb as FieldStatic<'organization'>, user, 'organization');
  }
}
