import { useState } from 'react';
import { FormGroup, Label } from 'reactstrap';

import IdfDropdownSearch from './IdfDropdownSearch';
import usaStates from '../../organizations/Constants.states.json';

const IdfSelectState = ({ label, value, onChange, ...restProps }) => {
  const [searchState, setSearchState] = useState({
    search: '',
  });

  const filteredData = usaStates.filter((state) =>
    state.name.toLowerCase().includes(searchState.search.toLowerCase())
  );

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: 'address_state',
        value: item.name,
      },
    });
  };

  const stateChange = (e) => {
    setSearchState({
      ...searchState,
      search: e.target.value,
    });
  };

  return (
    <FormGroup>
      <Label>{label}</Label>
      <IdfDropdownSearch
        id="address_state"
        title="Search for state"
        data={filteredData}
        customTitle="name"
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={value.address_state}
        onChange={stateChange}
        {...restProps}
      />
    </FormGroup>
  );
};

export default IdfSelectState;
