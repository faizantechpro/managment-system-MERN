import { useEffect, useState } from 'react';
import { FormGroup, Label } from 'reactstrap';

import tenantService from '../../../services/tenant.service';
import IdfDropdownSearch from './IdfDropdownSearch';

const IdfSelectTenant = ({ label, value, onChange, ...restProps }) => {
  const [tenantData, setTenantData] = useState([]);
  const [searchTenant, setSearchTenant] = useState({
    search: '',
  });

  useEffect(() => {
    getTenants();
  }, []);

  const getTenants = async () => {
    const result = await tenantService.getTenants({}, {});
    setTenantData(result.data);
  };

  const filteredData = tenantData.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchTenant?.search?.toLowerCase())
  );

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: 'tenant',
        value: item,
      },
    });
  };

  const stateChange = (e) => {
    setSearchTenant({
      ...searchTenant,
      search: e.target.value,
    });
  };

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <IdfDropdownSearch
        title="Search for Tenant"
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

export default IdfSelectTenant;
