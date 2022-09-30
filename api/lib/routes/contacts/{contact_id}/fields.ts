import {
  getAllFieldsByResource,
  upsertFieldByResource,
} from 'lib/utils/generics/fieldByResource';

export const GET = getAllFieldsByResource('Contact');

export const PUT = upsertFieldByResource('Contact');
