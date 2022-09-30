import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import Avatar from '../Avatar';

const CustomToggle = React.forwardRef(({ children, onClick, data }, ref) => {
  return (
    <div
      href=""
      className="cursor-pointer"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        if (data?.length > 0) {
          onClick(e);
        }
      }}
    >
      {children}
    </div>
  );
});

CustomToggle.displayName = 'CustomToggleLink';

const CustomMenu = React.forwardRef(({ children, style, className }, ref) => {
  return (
    <div ref={ref} style={style} className={className}>
      <ul className="list-unstyled">
        {React.Children.toArray(children).map((child, key) => {
          return (
            <li key={key} className="cursor-auto">
              {child}
            </li>
          );
        })}
      </ul>
    </div>
  );
});

CustomMenu.displayName = 'CustomMenuLink';

const DropdownLink = ({ title, data, id, classMenu = '' }) => {
  const history = useHistory();
  const ref = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isMenuOpen && ref.current && !ref.current.contains(e.target)) {
        setIsMenuOpen(false);
        setActive(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [isMenuOpen]);

  return (
    <Dropdown
      show={isMenuOpen}
      onToggle={(isOpen, event, metadata) => {
        if (metadata.source !== 'select') {
          setIsMenuOpen(isOpen);
        }
      }}
      ref={ref}
      id={`dropdown-link-${id}`}
    >
      <Dropdown.Toggle
        as={CustomToggle}
        data={data}
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          setActive((active) => !active);
        }}
      >
        <span className={active ? 'text-primary' : ''}>{title}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu} className={classMenu}>
        {data?.map((item) => (
          <Dropdown.Item
            key={item.id}
            onClick={(e) => {
              e.preventDefault();
              if (item.url) {
                history.push(item.url);
              }
            }}
          >
            <div className="d-flex align-items-center">
              <Avatar classModifiers={`avatar-xs mr-2`} user={item} />
              {item.value}
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownLink;
