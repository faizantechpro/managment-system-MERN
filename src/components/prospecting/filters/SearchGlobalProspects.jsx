import React from 'react';
import { Form } from 'react-bootstrap';

import SearchDefault from '../../commons/SearchDefault';

const SearchGlobalProspects = ({ data, setData, onHandleDone }) => {
  const onHandleSwitch = () => {
    const type = data?.global?.type === 'company' ? 'contact' : 'company';
    setData({ ...data, global: { ...data.global, type } });
  };

  const onHandleChangeInputSearch = (e) => {
    const text = e.target.value;
    setData({ ...data, global: { ...data.global, text } });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onHandleDone(true);
    }
  };

  return (
    <div>
      <SearchDefault
        id="search-prospects"
        placeholder="Search"
        label="Search"
        value={data.global.text}
        onHandleKeyPress={handleKeyPress}
        onHandleChange={onHandleChangeInputSearch}
      />

      <div className="fw-normal d-flex my-2">
        <span className="mr-2">Search by contacts</span>
        <Form.Check
          type="switch"
          checked={data?.global?.type !== 'company'}
          id="custom-switch-prospects"
          onChange={onHandleSwitch}
        />
      </div>
    </div>
  );
};

export default SearchGlobalProspects;
