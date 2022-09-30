import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

import IdfFormInput from '../../../idfComponents/idfFormInput/IdfFormInput';

const DropDownSearch = ({
  placeholder,
  onChange,
  onSelect,
  options = [],
  customKey,
}) => {
  const dropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const onHandleChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
    onChange(value);
    setIsMenuOpen(true);
  };

  const onHandleSelect = (item) => {
    onSelect(item);
    setInputValue('');
    onChange('');
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        isMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [isMenuOpen]);

  return (
    <div>
      <Dropdown
        show={isMenuOpen}
        drop="down"
        onToggle={(isOpen, event, metadata) => {
          if (metadata.source !== 'select') {
            setIsMenuOpen(isOpen);
            if (isOpen) {
              onChange(inputValue);
            }
          }
        }}
      >
        <Dropdown.Toggle
          as="div"
          className="tags-dropdown w-100 border rounded dropdown-input p-0"
          id="dropdown-basic"
        >
          <div>
            <IdfFormInput
              className="mb-0 w-100"
              inputClassName="border-0"
              placeholder={placeholder}
              value={{ search: inputValue }}
              name="search"
              onChange={onHandleChange}
              autocomplete="off"
            />
          </div>
        </Dropdown.Toggle>

        {!!options.length && (
          <Dropdown.Menu className="w-100 basic-animation menu-drop-style py-1">
            {options.map((item, index) => {
              const title = customKey ? item[customKey] : item;
              return (
                <Dropdown.Item
                  as="span"
                  className="cursor-pointer"
                  key={index}
                  onClick={onHandleSelect.bind(null, item)}
                >
                  {title}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        )}
      </Dropdown>
    </div>
  );
};

export default DropDownSearch;
