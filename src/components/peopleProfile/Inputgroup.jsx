import React from 'react';

const Inputgroup = ({
  name,
  value,
  type = 'text',
  onChange,
  label,
  required,
}) => {
  return (
    <div className="form-group mb-3">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        className="form-control"
        id={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default Inputgroup;
