import { getAllFields, upsertField } from 'lib/utils/generics/field';

export const GET = getAllFields('Organization');

export const PUT = upsertField('Organization');
