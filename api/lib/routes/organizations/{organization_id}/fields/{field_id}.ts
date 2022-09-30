import {
  getFieldByResource,
  removeFieldByResource,
} from 'lib/utils/generics/fieldByResource';

export const GET = getFieldByResource('Organization');

export const DELETE = removeFieldByResource('Organization');
