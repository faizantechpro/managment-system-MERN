import React from 'react';
import { Form } from 'react-bootstrap';

const IdfCheckbox = ({ label, name, value, checked, onChange, type }) => {
  return (
    <Form.Check
      type={type}
      name={name}
      label={label}
      value={value}
      checked={checked}
      onChange={onChange}
    />
  );
};

IdfCheckbox.defaultProps = {
  // checkbox or radio
  type: 'checkbox',
  label: '',
  name: '',
  value: false,
  onChange: () => {},
};

export default IdfCheckbox;
