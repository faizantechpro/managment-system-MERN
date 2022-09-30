import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import industriesService from '../../../services/industries.service';
import IdfDropdownSearch from './IdfDropdownSearch';

const IdfSelectIndustry = ({ label, onChange, value, ...restProps }) => {
  const [industries, setIndustries] = useState([]);
  const [selectIndustry, setSelectIndustry] = useState(null);
  const [search, setSearch] = useState('');

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: 'industry',
        value: item.name,
      },
    });
    onChange({
      target: {
        name: 'naics_code',
        value: item.id,
      },
    });

    setSelectIndustry(item.title);
  };

  const onHandleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const getIndustries = async (search = '') => {
    try {
      const result = await industriesService.getIndustries({ search });
      const { data } = result.data;
      const industriesArray = data.map((item) => ({
        id: item.code,
        name: item.title,
        title: `${item.code} - ${item.title}`,
      }));

      setIndustries(industriesArray);
    } catch (e) {
      console.log(e);
    }
  };

  const getIndustry = async (id) => {
    try {
      const { data } = await industriesService.getIndustryByCode(id);

      setSelectIndustry(`${data.code} - ${data.title}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getIndustries(search);
  }, [search]);

  useEffect(() => {
    if (value?.naics_code) {
      getIndustry(value?.naics_code);
    }
  }, [value]);

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <IdfDropdownSearch
        title="Search for Industry"
        data={industries}
        customTitle="title"
        onHandleSelect={(_, item) => fieldInFields(item)}
        value={selectIndustry}
        onChange={onHandleChange}
        {...restProps}
      />
    </Form.Group>
  );
};

export default IdfSelectIndustry;
