export const options = [
  {
    id: 'select2-4dd5-result-all',
    title: 'All',
    name: 'all',
  },
  {
    id: 'select2-4dd5-result-active',
    title: 'Active',
    name: 'active',
  },
  {
    id: 'select2-4dd5-result-invited',
    title: 'Invited',
    name: 'invited',
  },
  {
    id: 'select2-4dd5-result-suspended',
    title: 'Suspended',
    name: 'suspended',
  },
  {
    id: 'select2-4dd5-result-deactivated',
    title: 'Deactivated',
    name: 'deactivated',
  },
];

export const usersColumns = [
  {
    key: 'user',
    orderBy: 'first_name',
    component: <span>User</span>,
  },
  {
    key: 'role',
    orderBy: 'role',
    component: <span>Role</span>,
  },
  {
    key: 'status',
    orderBy: 'status',
    component: <span>Status</span>,
  },
  {
    key: 'tenant',
    orderBy: 'tenant_id',
    onlyAdmin: true,
    component: <span>Tenant</span>,
  },
  {
    key: 'last_login',
    orderBy: 'last_access',
    component: <span>Last Login</span>,
  },
];
