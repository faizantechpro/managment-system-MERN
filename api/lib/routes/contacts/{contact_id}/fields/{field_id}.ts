import {
  getFieldByResource,
  removeFieldByResource,
} from 'lib/utils/generics/fieldByResource';

export const GET = getFieldByResource('Contact');

export const DELETE = removeFieldByResource('Contact');
