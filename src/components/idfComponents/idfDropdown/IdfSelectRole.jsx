import { useEffect, useState } from 'react';
import { FormGroup, Label } from 'reactstrap';

import roleService from '../../../services/role.service';
import { ALL_LABEL } from '../../../utils/constants';
import IdfDropdownSearch from './IdfDropdownSearch';

const IdfSelectRole = ({
  label,
  value,
  onChange,
  showAll,
  query,
  ...restProps
}) => {
  const [roleData, setRoleData] = useState([]);

  const [searchRole, setSearchRole] = useState({
    search: '',
  });

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    const searchResults = await roleService
      .GetRoles(query)
      .catch((err) => console.log(err));

    const { data } = searchResults || {};

    showAll && data?.unshift({ name: ALL_LABEL });

    setRoleData(data);
  };

  const filteredData = roleData.filter((role) =>
    role.name.toLowerCase().includes(searchRole?.search?.toLowerCase())
  );

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: 'status',
        value: item,
      },
    });
  };

  const stateChange = (e) => {
    setSearchRole({
      ...searchRole,
      search: e.target.value,
    });
  };

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <IdfDropdownSearch
        title="Search for Role"
        data={filteredData}
        customTitle="name"
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={value?.search || ''}
        onChange={stateChange}
        {...restProps}
      />
    </FormGroup>
  );
};

export default IdfSelectRole;
