import { PermissionsWrapper } from '../../../utils/Utils';

export const statusDefault = [
  {
    id: 1,
    name: 'cold',
    type: 'COLD LEAD',
    cash: '$21,516',
    count: 6,
    items: [],
  },
  {
    id: 2,
    name: 'warm',
    type: 'WARM LEAD',
    cash: '$21,516',
    count: 6,
    items: [],
  },
  {
    id: 3,
    name: 'hot',
    type: 'HOT LEAD',
    cash: '$21,516',
    count: 6,
    items: [],
  },
  {
    id: 4,
    name: 'won',
    type: 'CLOSED - WON',
    cash: '$21,516',
    count: 6,
    items: [],
  },
  {
    id: 5,
    name: 'lost',
    type: 'CLOSED - LOST',
    cash: '$21,516',
    count: 6,
    items: [],
  },
];

export const colorsDeals = ['primary', 'yellow', 'orange', 'green', 'red'];

export const items = () => {
  const hasPermissions = PermissionsWrapper({
    collection: 'deals',
    action: 'delete',
  });

  if (hasPermissions) {
    return [
      {
        id: 'add',
        icon: 'add',
        name: 'Add Deal',
      },
      {
        id: 'edit',
        icon: 'edit',
        name: 'Edit Deal',
      },
      {
        id: 'remove',
        icon: 'delete',
        name: 'Remove',
        className: 'text-danger',
      },
    ];
  } else {
    return [
      {
        id: 'add',
        icon: 'add',
        name: 'Add Deal',
      },
      {
        id: 'edit',
        icon: 'edit',
        name: 'Edit Deal',
      },
    ];
  }
};
