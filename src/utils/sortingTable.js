export const sortingTable = ({ name, order, setOrder }) => {
  const variantName = {
    badge: {
      field: 'name',
    },
    category: {
      field: 'title',
    },
    label: {
      field: 'name',
    },
    parent: {
      field: 'name',
    },
    organization: {
      field: 'name',
    },
    contact: {
      field: 'first_name',
    },
  };

  if (!name || name === 'owner') return false;

  if (variantName[name]) {
    const [key, field, value] = order;

    if (key === name) {
      const newValue = value === 'ASC' ? 'DESC' : 'ASC';
      return setOrder([name, field || variantName[name].field, newValue]);
    }

    return setOrder([name, variantName[name].field, 'DESC']);
  }

  const [key, value] = order;

  if (key === name) {
    const newValue = value === 'ASC' ? 'DESC' : 'ASC';

    return setOrder([key, newValue]);
  }

  setOrder([name, 'DESC']);
};
