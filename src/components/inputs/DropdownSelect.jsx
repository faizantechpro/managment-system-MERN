import { useEffect, useState } from 'react';
import { Col, Dropdown } from 'react-bootstrap';

import Item from '../Item';
import { CardLabel } from '../layouts/ActivityLayout';
import List from '../List';

const DropdownSelect = ({
  id,
  defaultOption,
  onChange,
  onClick,
  name,
  placeholder,
  value,
  options,
  error,
  setSelection,
  className,
  label,
  labelSize,
  noScrolling,
  formClassName,
}) => {
  const [optionsDropdown, setOptionsDropdown] = useState([]);

  const handleCollapse = () => {
    const dropdownMenu = document.getElementById(id);
    dropdownMenu.classList.remove('show');
  };

  useEffect(() => {
    defaultOption
      ? setOptionsDropdown([{ name: defaultOption }, ...options])
      : setOptionsDropdown(options);
  }, []);

  return (
    <CardLabel
      label={label}
      labelSize={labelSize}
      formClassName={formClassName}
    >
      <Dropdown drop="down" className={className} onClick={onClick}>
        <Dropdown.Toggle
          className="w-100 dropdown-input"
          variant="outline-link"
          id="dropdown"
        >
          <span>{`${value?.name ? value.name : defaultOption}`}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="w-100" id={id}>
          <Col xs={12} className="px-3">
            {error && error.error && (
              <p className="alert-danger px-3 py-1 mb-1 rounded">{error.msg}</p>
            )}
            <List
              className={`dropdown-results ${
                (noScrolling && 'no-scrolling') || ''
              }`}
            >
              {optionsDropdown?.map((item, key) => {
                const id = `data-${item.name}`;
                return (
                  <div key={id}>
                    <Item
                      id={id}
                      onClick={() => {
                        setSelection(item);
                        handleCollapse();
                      }}
                    >
                      {item.name}
                    </Item>
                    {item.name === defaultOption && <hr className={`my-1`} />}
                  </div>
                );
              })}
            </List>
          </Col>
        </Dropdown.Menu>
      </Dropdown>
    </CardLabel>
  );
};

export default DropdownSelect;
