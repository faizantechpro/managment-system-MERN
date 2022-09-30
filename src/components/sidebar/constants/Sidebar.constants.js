import routes from '../../../utils/routes.json';

export const sidebarData = [
  {
    id: '1',
    title: 'Dashboards',
    icon: 'dashboard',
    path: '/',
  },
  {
    id: '2',
    title: 'Contacts',
    path: routes.contacts,
    icon: 'people',
    permissions: { collection: 'contacts', action: 'view' },
  },
  {
    id: '3',
    title: 'Deals',
    icon: 'monetization_on',
    path: routes.pipeline,
    permissions: { collection: 'deals', action: 'view' },
  },
  {
    id: '4',
    title: 'Resources',
    path: routes.resources,
    icon: 'person_search',
    permissions: { collection: 'resources', action: 'view' },
  },
  {
    id: '4',
    title: 'Reports',
    path: routes.reports,
    icon: 'analytics',
    permissions: { collection: 'insights', action: 'view' },
  },
  {
    id: '5',
    title: 'Training',
    icon: 'school',
    submenu: true,
    items: [
      {
        id: '5.1',
        title: 'My Favorites',
        path: routes.favorites,
      },
      {
        id: '5.3',
        title: 'Explore',
        submenu: true,
        items: [],
      },
    ],
  },
];
