import { getAllFields, upsertField } from 'lib/utils/generics/field';

export const GET = getAllFields('Contact');

export const PUT = upsertField('Contact');
