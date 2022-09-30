import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';

const SearchDefault = ({
  id = 'datableSearch',
  placeholder = 'Search',
  label = 'Search',
  onHandleChange,
  onHandleKeyPress,
  value,
}) => {
  return (
    <InputGroup className="input-group-merge">
      <InputGroup.Prepend>
        <InputGroup.Text>
          <i className="material-icons-outlined">search</i>
        </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        id={id}
        type="search"
        value={value}
        onKeyPress={onHandleKeyPress}
        placeholder={placeholder}
        arial-label={label}
        onChange={onHandleChange}
        className="rounded-pill"
      />
    </InputGroup>
  );
};

export default SearchDefault;
