import React from 'react';
import { Dropdown } from 'react-bootstrap';

const IdfDropdown = ({ defaultValue, className, variant, items, onChange }) => {
  const [value, setValue] = React.useState('');

  const handleChange = (selected) => {
    setValue(selected.label);
    onChange(selected);
  };

  return (
    <Dropdown>
      {items.length > 0 && (
        <>
          <Dropdown.Toggle
            id="dropdown-basic"
            variant={variant}
            className={`btn-ghost-primary ${className}`}
          >
            {value || items.find((item) => item.value === defaultValue)?.label}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {items?.map((item) => (
              <Dropdown.Item
                key={item.value}
                onClick={handleChange.bind(this, item)}
              >
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </>
      )}
    </Dropdown>
  );
};

export default IdfDropdown;
