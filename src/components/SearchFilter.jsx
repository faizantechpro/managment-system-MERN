import { useState, useEffect } from 'react';

// import userService from '../services/user.service';
import DropdownSearch from './DropdownSearch';
import DropdownSelect from './DropdownSelect';

const SearchFilter = (props) => {
  const {
    type,
    onHandleSelect,
    filterSelected,
    options,
    callbackService,
    callbackRequest,
    callbackResponseData,
    customTitle,
    searchPlaceholder,
    showAvatar,
  } = props;

  const [filter, setFilter] = useState({
    search: '',
    users: [],
    filters: '',
  });
  const [data, setData] = useState([]);

  const getData = async () => {
    const response = await callbackService[callbackRequest](filter, {
      page: 1,
      limit: 10,
    }).catch((err) => err);

    const { data } = response || {};

    setData(callbackResponseData && data ? data[callbackResponseData] : data);
  };

  useEffect(() => {
    if (callbackService) getData();
  }, [filter]);

  const onInputSearch = async (e) => {
    if (e) {
      setFilter({
        ...filter,
        search: e.target.value,
      });
    }
  };

  if (type === 'search') {
    return (
      <DropdownSearch
        allOption
        title={searchPlaceholder}
        name="filterByOwner"
        onChange={onInputSearch}
        data={data}
        onHandleSelect={onHandleSelect}
        customTitle={customTitle}
        showAvatar={showAvatar}
      />
    );
  }

  return (
    <DropdownSelect
      allOption
      data={options}
      onHandleSelect={onHandleSelect}
      select={filterSelected}
    />
  );
};

export default SearchFilter;
