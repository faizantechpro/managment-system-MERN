import { useState } from 'react';
import { FormGroup, Label } from 'reactstrap';

import IdfDropdownSearch from './IdfDropdownSearch';

const EMPLOYEES_VALUES = [
  { name: '1-10' },
  { name: '10-50' },
  { name: '50-100' },
  { name: 'more than 100' },
];

const IdfSelectEmployees = ({ label, value, onChange, ...restProps }) => {
  const [searchEmployeesNumber, setSearchEmployeesNumber] = useState({
    search: '',
  });

  const filteredData = EMPLOYEES_VALUES.filter((employ) =>
    employ.name
      .toLowerCase()
      .includes(searchEmployeesNumber.search.toLowerCase())
  );

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: 'employees',
        value: item.name,
      },
    });
  };

  const stateChange = (e) => {
    setSearchEmployeesNumber({
      ...searchEmployeesNumber,
      search: e.target.value,
    });
  };

  return (
    <FormGroup>
      <Label>{label}</Label>
      <IdfDropdownSearch
        title="Search for employees"
        data={filteredData}
        customTitle="name"
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={value.employees}
        onChange={stateChange}
        {...restProps}
      />
    </FormGroup>
  );
};

export default IdfSelectEmployees;
