import {
  getAllFieldsByResource,
  upsertFieldByResource,
} from 'lib/utils/generics/fieldByResource';

export const GET = getAllFieldsByResource('Organization');

export const PUT = upsertFieldByResource('Organization');
