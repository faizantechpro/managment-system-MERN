import { useState, useEffect } from 'react';
import { FormGroup, Label } from 'reactstrap';

import IdfDropdownSearchWithCheckbox from './IdfDropdownSearchWithCheckbox';
import userService from '../../../services/user.service';

const IdfSelectContactsWithCheck = ({
  label,
  onChange,
  value,
  noDefault,
  onClickApplyFilter,
  ...restProps
}) => {
  const { checkedList } = restProps;

  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [searchUser, setSearchUser] = useState({
    search: '',
  });

  useEffect(async () => {
    const extraData = checkedList?.map((users) => users.id);

    const options = {
      search: searchUser.search,
      filters: `$filter=status ne 'invited'`,
    };

    const response = await userService
      .getUsers(options, { limit: 1000, extraData })
      .catch((err) => console.log(err));

    const { data } = response || {};

    setUsersData(data?.users);
  }, [searchUser.search, checkedList]);

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: 'userId',
        value: item,
      },
    });

    setSelectedUser(`${item.first_name} ${item.last_name}`);
  };

  const stateChange = (e) => {
    setSearchUser({
      ...searchUser,
      search: e.target.value,
    });
  };

  return (
    <FormGroup className="m-0">
      {label && <Label>{label}</Label>}
      <IdfDropdownSearchWithCheckbox
        id="dropdown-user-checked"
        title="User"
        data={usersData}
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={selectedUser}
        onChange={stateChange}
        noDefault
        searchItem={setSearchUser}
        togglePlaceholder="Select Users"
        internalPlaceholder="Search Users"
        showAvatar
        applyFilter={onClickApplyFilter}
        placeholderToggleSelect
        {...restProps}
      />
    </FormGroup>
  );
};

export default IdfSelectContactsWithCheck;
