import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

import MaterialIcon from './MaterialIcon';
import Masonry from 'react-masonry-css';
import Search from '../manageUsers/Search';

const IconDropdownSearch = ({ onSelect, options = [], children }) => {
  const dropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const onHandleChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
    setIsMenuOpen(true);
  };

  const onHandleSelect = (item) => {
    onSelect(item);
    setInputValue('');
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
        className="position-absolute bottom-0 right-0"
        onToggle={(isOpen, event, metadata) => {
          if (metadata.source !== 'select') {
            setIsMenuOpen(isOpen);
          }
        }}
      >
        <Dropdown.Toggle
          as="div"
          className="tags-dropdown w-100 border rounded dropdown-input p-0"
          id="dropdown-basic"
        >
          <div>{children}</div>
        </Dropdown.Toggle>

        {!!options.length && (
          <>
            <Dropdown.Menu
              className="w-100 basic-animation shadow-lg rounded-lg p-3 overflow-x-hidden"
              style={{ overflowX: 'hidden', minWidth: 250, height: 300 }}
            >
              {isMenuOpen && (
                <Search
                  onHandleChange={onHandleChange}
                  searchPlaceholder={'Search'}
                  classnames="px-0 mb-2 w-auto"
                />
              )}
              <Masonry breakpointCols={5} className="d-flex">
                {options
                  .filter((icon) =>
                    icon.label.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((item, index) => {
                    return (
                      <Dropdown.Item
                        as="div"
                        className="cursor-pointer p-1 text-center"
                        key={index}
                        onClick={onHandleSelect.bind(null, item)}
                      >
                        <MaterialIcon icon={item.name} clazz="font-size-xl2" />
                      </Dropdown.Item>
                    );
                  })}
              </Masonry>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>
    </div>
  );
};

export default IconDropdownSearch;
