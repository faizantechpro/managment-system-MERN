import { useState, useEffect } from 'react';
import { FormGroup, Label } from 'reactstrap';

import IdfDropdownSearch from './IdfDropdownSearch';
import { onGetOwners } from '../../../views/Deals/contacts/utils';
import userService from '../../../services/user.service';

const IdfSelectUser = ({
  label,
  onChange,
  value,
  noDefault,
  title,
  mainOwner,
  owners,
  ...restProps
}) => {
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [searchUser, setSearchUser] = useState({
    search: '',
  });

  useEffect(async () => {
    if (!noDefault) {
      const me = await getCurrentUser().catch((err) => console.log(err));

      onChange({
        target: {
          name: name || 'assigned_user_id',
          value: me?.id,
        },
      });
      setSelectedUser(`${me?.first_name} ${me?.last_name}`);
    }
  }, []);

  useEffect(() => {
    // onGetOwners is using user_id when mapping and filtering so passing it like that
    const existUsers = owners
      ? owners.map((owner) => ({ user_id: owner.user.id }))
      : [];
    const existingUsers = mainOwner
      ? [{ user_id: mainOwner.id }, ...existUsers]
      : null;
    onGetOwners(searchUser, setUsersData, existingUsers);
  }, [searchUser.search]);

  const getCurrentUser = async () => {
    const user = await userService
      .getUserInfo()
      .catch((err) => console.error(err));

    return user;
  };

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: 'assigned_user_id',
        value: item.id,
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
    <FormGroup>
      {label && <Label>{label}</Label>}
      <IdfDropdownSearch
        title={title || 'Search for owner'}
        data={usersData}
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={selectedUser}
        onChange={stateChange}
        {...restProps}
      />
    </FormGroup>
  );
};

export default IdfSelectUser;
