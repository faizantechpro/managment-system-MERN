import userService from '../../../services/user.service';
import {
  ADDRESS_STATE,
  ADDRESS_STREET,
  DEAL_TYPE,
  EMAIL_LOCATION,
  EMAIL_LOCATION_1,
  EMAIL_LOCATION_2,
  PHONE_LOCATION,
  PHONE_LOCATION_2,
  PHONE_LOCATION_3,
  PHONE_LOCATION_4,
  STATUS,
} from '../../../utils/constants';
import {
  initialFilters,
  initialOrgForm,
  initialPeopleForm,
  initialDealsForm,
} from './Contacts.constants';

export const onGetOwners = (
  filter,
  dataCallback,
  existingOwners,
  extraData
) => {
  async function onGetUsers() {
    const response = await userService
      .getUsers(
        { ...filter, status: 'active' },
        {
          limit: 10,
          extraData,
        }
      )
      .catch((err) => err);

    const { data } = response || {};
    let users = [];

    if (existingOwners && Object.keys(data).length) {
      // only interested in users who are not existing owners
      const existingOwnerIds = existingOwners.map(({ user_id }) => user_id);
      users = data.users.filter(({ id }) => !existingOwnerIds.includes(id));
    }

    return dataCallback(
      users.length
        ? users.filter((i) => i?.first_name && i?.last_name)
        : !existingOwners
        ? data?.users.filter((i) => i?.first_name && i?.last_name)
        : []
    );
  }

  onGetUsers();
};

export const onInputSearch = async (e, data, setData) => {
  if (!e) {
    return setData({
      search: '',
    });
  }

  const { value } = e.target;

  setData({
    ...data,
    search: value || '',
  });
};

export const onHandleSelect = (item, name, dispatch, setSelect) => {
  if (name === STATUS || name === DEAL_TYPE) setSelect(item.title);

  if (name === 'lead_source') setSelect(item.name);

  if (name === 'label_id') {
    return dispatch({
      type: 'set',
      input: name,
      payload: item.target.value,
    });
  }

  if (name === DEAL_TYPE) {
    return dispatch({
      type: 'set',
      input: name,
      payload: item.id,
    });
  }

  if (name === 'organization_id' && item.organization_id) {
    return dispatch({
      type: 'set',
      input: name,
      payload: item.organization_id,
    });
  }

  const payloadFields = [
    EMAIL_LOCATION,
    EMAIL_LOCATION_1,
    EMAIL_LOCATION_2,
    PHONE_LOCATION,
    PHONE_LOCATION_2,
    PHONE_LOCATION_3,
    PHONE_LOCATION_4,
    ADDRESS_STATE,
    ADDRESS_STREET,
  ];

  dispatch({
    type: 'set',
    input: name,
    payload:
      payloadFields.includes(name) ||
      name.includes(PHONE_LOCATION) ||
      name.includes(EMAIL_LOCATION)
        ? item.name
        : item.id,
  });
};

export const onInputChange = (e, dispatch) => {
  const { name, value, type } = e.target;

  if (name === 'amount') {
    const preg = /^([0-9]+\.?[0-9]{0,2})$/;

    if (preg.test(value)) {
      return dispatch({
        type: 'set',
        input: name,
        payload: value,
      });
    } else if (value < 2) {
      dispatch({
        type: 'set',
        input: name,
        payload: value,
      });
    }

    return;
  }

  dispatch({
    type: 'set',
    input: name,
    payload: type === 'number' ? Number(value) : value,
  });
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'load':
      return {
        ...action.payload,
      };
    case 'add_email':
    case 'add_phone':
      return {
        ...state,
        ...action.payload,
      };
    case 'set':
      return {
        ...state,
        [action.input]: action.payload,
      };
    case 'remove':
      delete state[action.input];

      return {
        ...state,
      };
    case 'reset':
      return initialFilters;
    case 'reset-peopleForm':
      return initialPeopleForm;
    case 'reset-orgForm':
      return initialOrgForm;
    case 'reset-dealForm':
      return initialDealsForm;
    default:
      return state;
  }
};

export const tableFiltersReducer = (state, action) => {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        [action.input]: action.fullPayLoad,
      };
    case 'remove':
      delete state[action.input];

      return {
        ...state,
      };
    case 'reset':
      return {};
    default:
      return state;
  }
};

export const changePaginationPage = (newPage, setPaginationPage) => {
  setPaginationPage((prev) => ({ ...prev, page: newPage }));
};

export const onHandleCloseModal = (dispatch, toggle, type) => {
  dispatch({
    type,
  });

  toggle();
};
