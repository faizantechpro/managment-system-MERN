import React from 'react';
import { Form } from 'react-bootstrap';

import './CheckLocationConference.css';

const CheckLocationConference = ({
  id,
  disabled,
  name,
  onChange,
  value,
  size,
  labelSize,
  placeholder,
}) => {
  return (
    <div className="check-location-conference pl-2">
      <Form.Control
        xs={labelSize === `full` ? 12 : ''}
        disabled={disabled}
        type="text"
        onChange={onChange}
        value={value}
        id={id}
        name={name}
        placeholder={placeholder}
        size={size || 'sm'}
      />
    </div>
  );
};

export default CheckLocationConference;
