import { Permission } from '../types/permissions';
import { permissions } from '../utils/permissions';
import { PermissionRepository } from '../database/models/permission';
type ResourceType = {
  id: string;
  type: 'deals' | 'organizations' | 'contacts' | '';
};

type ResourceTypes = {
  organization_id?: string;
  deal_id?: string;
  contact_id?: string;
};

export const getResourceTypeWithId = ({
  organization_id,
  deal_id,
  contact_id,
}: ResourceTypes): ResourceType => {
  if (deal_id) {
    return { type: 'deals', id: deal_id };
  } else if (organization_id) {
    return { type: 'organizations', id: organization_id };
  } else if (contact_id) {
    return { type: 'contacts', id: contact_id };
  } else {
    return { type: '', id: '' };
  }
};

type AllowedActionsType = {
  deals: boolean;
  accounts: boolean;
  contacts: boolean;
  categories: boolean;
  courses: boolean;
  lessons: boolean;
};

type returnInsertUnionType = {
  organizations: boolean;
  contacts: boolean;
  activity: boolean;
  file: boolean;
  categories: boolean;
  courses: boolean;
  lessons: boolean;
};

export const sortByValue = (jsObj: any) => {
  const sortedArray = [];
  for (const i in jsObj) {
    // Push each JSON Object entry in array by [value, key]
    sortedArray.push([Number(jsObj[i].toFixed(2)), i]);
  }
  // return sortedArray.sort();
  return sortedArray.sort((a: any, b: any) => {
    return b[0] - a[0];
  });
};

/**
 * Check which action user is allowed
 */
export const checkIsAllowed = (
  rolePermissions: PermissionRepository[]
): AllowedActionsType => {
  const isAllowAction = {
    deals: true,
    accounts: true,
    contacts: true,
    categories: true,
    courses: true,
    lessons: true,
  };

  isAllowAction.deals = hasAccessToPermission(
    rolePermissions,
    permissions.deals.view
  )
    ? true
    : false;
  isAllowAction.contacts = hasAccessToPermission(
    rolePermissions,
    permissions.contacts.view
  )
    ? true
    : false;
  isAllowAction.accounts = hasAccessToPermission(
    rolePermissions,
    permissions.accounts.view
  )
    ? true
    : false;
  isAllowAction.categories = hasAccessToPermission(
    rolePermissions,
    permissions.categories.view
  )
    ? true
    : false;
  isAllowAction.courses = hasAccessToPermission(
    rolePermissions,
    permissions.courses.view
  )
    ? true
    : false;
  isAllowAction.lessons = hasAccessToPermission(
    rolePermissions,
    permissions.lessons.view
  )
    ? true
    : false;

  return isAllowAction;
};

/**
 * Check where union clause should be inserted in global search
 */
export const isInsertUnion = (isAllowAction: any): returnInsertUnionType => {
  const returnInsertUnion = {
    organizations: false,
    contacts: false,
    activity: false,
    file: false,
    categories: true,
    courses: true,
    lessons: true,
  };

  if (isAllowAction.deals && isAllowAction.accounts) {
    returnInsertUnion.organizations = true;
  }

  if (
    (isAllowAction.accounts || isAllowAction.deals) &&
    isAllowAction.contacts
  ) {
    returnInsertUnion.contacts = true;
  }

  if (isAllowAction.accounts || isAllowAction.deals || isAllowAction.contacts) {
    returnInsertUnion.activity = true;
  }

  if (isAllowAction.accounts || isAllowAction.deals || isAllowAction.contacts) {
    returnInsertUnion.file = true;
  }

  if (
    (isAllowAction.accounts || isAllowAction.deals || isAllowAction.contacts) &&
    isAllowAction.categories
  ) {
    returnInsertUnion.categories = true;
  }

  if (
    (isAllowAction.accounts ||
      isAllowAction.deals ||
      isAllowAction.contacts ||
      isAllowAction.categories) &&
    isAllowAction.courses
  ) {
    returnInsertUnion.courses = true;
  }

  if (
    (isAllowAction.accounts ||
      isAllowAction.deals ||
      isAllowAction.contacts ||
      isAllowAction.categories ||
      isAllowAction.courses) &&
    isAllowAction.lessons
  ) {
    returnInsertUnion.lessons = true;
  }

  return returnInsertUnion;
};

/**
 * Check specific permission is allowed against role's permission list
 */
export const hasAccessToPermission = (
  rolePermissions: PermissionRepository[],
  permissions?: Permission
): boolean => {
  if (!permissions?.collection || !permissions?.action) return false;
  if (!rolePermissions) return false;
  const permissionResults = rolePermissions.filter((permission) => {
    return (
      permission.collection === permissions?.collection &&
      permission.action === permissions.action &&
      permission.fields
    );
  });

  return permissionResults.length > 0;
};
export const removeDuplicate = (arr: any[]) => {
  return [...new Set(arr)];
};
