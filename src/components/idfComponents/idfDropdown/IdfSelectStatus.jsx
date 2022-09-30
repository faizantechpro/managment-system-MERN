import { useState } from 'react';
import { FormGroup, Label } from 'reactstrap';

import IdfDropdownSearch from './IdfDropdownSearch';

const labelsStatus = [
  { name: 'none', title: 'None' },
  { name: 'won', title: 'Won' },
  { name: 'hot', title: 'Hot Lead' },
  { name: 'warm', title: 'Warm Lead' },
  { name: 'cold', title: 'Cold Lead' },
];

const IdfSelectStatus = ({ label, value, onChange, ...restProps }) => {
  const [searchLabel, setSearchLabel] = useState({
    search: '',
  });

  const filteredData = labelsStatus.filter((status) =>
    status.name.toLowerCase().includes(searchLabel.search.toLowerCase())
  );

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: 'status',
        value: item.name,
      },
    });
  };

  const stateChange = (e) => {
    setSearchLabel({
      ...searchLabel,
      search: e.target.value,
    });
  };

  return (
    <FormGroup>
      <Label>{label}</Label>
      <IdfDropdownSearch
        title="Search for label"
        data={filteredData}
        customTitle="title"
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={value.status || labelsStatus[0].title}
        onChange={stateChange}
        {...restProps}
      />
    </FormGroup>
  );
};

export default IdfSelectStatus;
