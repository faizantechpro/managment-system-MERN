export const initialFiltersItems = [];

export const organizationColumns = [
  {
    key: 'name',
    orderBy: 'name',
    component: <span>Organization Name</span>,
    // width: '380px',
  },
  {
    key: 'label',
    orderBy: 'label',
    component: <span>Label</span>,
    // width: '195px',
  },
  {
    key: 'address',
    orderBy: 'address_city',
    component: <span>Address</span>,
    // width: '195px',
  },
  {
    key: 'phone_office',
    orderBy: 'phone_office',
    component: <span>Phone</span>,
    // width: '195px',
  },
  {
    key: 'total_revenue',
    orderBy: 'total_revenue',
    component: <span>Revenue</span>,
    // width: '195px',
  },
  {
    key: 'employees',
    orderBy: 'employees',
    component: <span>Employees</span>,
    // width: '195px',
  },
  // {
  //   key: 'website',
  //   orderBy: 'website',
  //   component: <span>Website</span>,
  //   // width: '195px',
  // },
  // {
  //   key: 'naics_code',
  //   orderBy: 'naics_code',
  //   component: <span>NAICS Code</span>,
  //   // width: '195px',
  // },
];

export const peopleColumns = [
  {
    key: 'name',
    orderBy: 'first_name',
    component: <span>Name</span>,
    // width: '380px',
  },
  {
    key: 'organization',
    orderBy: 'organization',
    component: <span>Organization</span>,
    // width: '195px',
  },
  {
    key: 'label',
    orderBy: 'label',
    component: <span>Label</span>,
    // width: '195px',
  },
  {
    key: 'email',
    orderBy: 'email_work',
    component: <span>Email</span>,
    // width: '195px',
  },
  {
    key: 'phone',
    orderBy: 'phone_work',
    component: <span>Phone</span>,
    // width: '195px',
  },
  {
    key: 'total_closed_deals',
    orderBy: 'total_closed_deals',
    component: <span>Closed Deals</span>,
    // width: '195px',
  },
  {
    key: 'total_open_deals',
    orderBy: 'total_open_deals',
    component: <span>Open Deals</span>,
    // width: '195px',
  },
  {
    key: 'owner',
    orderBy: 'owner',
    component: <span>Owner(S)</span>,
    // width: '195px',
  },
];

export const tagsColor = {
  cold: 'primary',
  warm: 'secondary bg-yellow',
  hot: 'warning',
  won: 'success',
  lost: 'danger',
};

export const tagsColorHex = {
  cold: '#092ace',
  warm: '#f2c94c',
  hot: '#ff5a2c',
  won: '#27ae60',
  lost: '#f44336',
};

export const tagsColorNormal = {
  cold: 'blue',
  warm: 'orange',
  hot: 'red',
  won: 'green',
  lost: 'grey',
};

export const labels = [
  {
    id: 1,
    name: 'cold',
    title: 'Cold Lead',
  },
  {
    id: 2,
    name: 'warm',
    title: 'Warm Lead',
  },
  {
    id: 3,
    name: 'hot',
    title: 'Hot Lead',
  },
  {
    id: 4,
    name: 'won',
    title: 'Won',
  },
  {
    id: 5,
    name: 'lost',
    title: 'Lost',
  },
];

export const labelsHexByDefect = [
  {
    id: 1,
    color: '#27ae60',
  },
  {
    id: 2,
    color: '#f44336',
  },
  {
    id: 3,
    color: '#092ace',
  },
  {
    id: 4,
    color: '#f2c94c',
  },
  {
    id: 5,
    color: '#71869d',
  },
  {
    id: 6,
    color: '#00c9db',
  },
  {
    id: 7,
    color: '#132144',
  },
  {
    id: 8,
    color: '#ff5a2c',
  },
];

export const labelsPipelineHeader = [
  {
    id: 1,
    name: 'cold',
    title: 'Cold Lead',
  },
  {
    id: 2,
    name: 'warm',
    title: 'Warm Lead',
  },
  {
    id: 3,
    name: 'hot',
    title: 'Hot Lead',
  },
];

export const visibilities = [
  {
    id: 1,
    title: 'Owner only',
  },
  {
    id: 2,
    title: 'Owner visibility group',
  },
  {
    id: 3,
    title: 'owner group and subgroups',
  },
  {
    id: 4,
    title: 'entire company',
  },
];

export const dataLocation = [
  {
    id: 1,
    name: 'work',
    title: 'work',
  },
  {
    id: 2,
    name: 'home',
    title: 'home',
  },
  {
    id: 3,
    name: 'mobile',
    title: 'mobile',
  },
  {
    id: 4,
    name: 'other',
    title: 'other',
  },
];

export const emailDataLocation = [
  {
    id: 1,
    name: 'work',
    title: 'work',
  },
  {
    id: 2,
    name: 'home',
    title: 'personal',
  },
  {
    id: 3,
    name: 'other',
    title: 'other',
  },
];

export const initialFilters = {};

export const initialPeopleForm = {
  first_name: '',
  last_name: '',
  title: '',
  organization_id: null,
  status: '',
  phone: '',
  phone_location: 'work',
  email: '',
  email_location: 'work',
  assigned_user_id: null,
};

export const initialOrgForm = {
  name: '',
  status: '',
  assigned_user_id: null,
  // address: '',
  address_street: '',
  address_suite: '',
  address_city: '',
  address_state: '',
  address_country: '',
  address_postalcode: '',
};

export const initialDealsForm = {
  name: '',
  contact_person_id: null,
  contact_person_new: null,
  contact_organization_id: null,
  contact_organization_new: null,
  assigned_user_id: null,
  products: [],
  currency: 'USD',
};
