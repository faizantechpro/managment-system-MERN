import { useEffect, useState, useRef } from 'react';
import { Col, Form, Dropdown } from 'react-bootstrap';

import { tagsColorNormal } from '../../../views/Deals/contacts/Contacts.constants';
import Avatar from '../../Avatar';
import ItemAvatar from '../../ItemAvatar';
import ItemName from '../../ItemName';
import List from '../../List';

const IdfDropdownSearch = (props) => {
  const {
    id,
    title,
    data,
    customTitle,
    onHandleSelect,
    value,
    onChange,
    showAvatar,
    bulletPoints,
    className,
    hidden,
    showIcon,
    disabled,
    icon,
    bodyIcon,
    errorClass,
    withData,
    extraTitles,
  } = props;
  const dropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTitle, setSearchTitle] = useState(title);

  // Function used when the menu is open and the clicked target is not within the menu, then close the menu.
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

  useEffect(() => {
    setSearchTitle(value || title);
  }, [value]);

  const selectedText =
    (value && 'text-black') || (searchTitle !== title && 'text-black');

  const handleSelect = (e, item) => {
    onHandleSelect(e, item);
    setIsMenuOpen(false);
    setSearchTitle(item[customTitle] || `${item.first_name} ${item.last_name}`);
  };

  if (disabled) {
    const dropToDisable = document.getElementById('dropdown-toogle');

    if (dropToDisable) {
      dropToDisable.classList.add('drop-disabled');
    }
  }

  const onToggle = (isOpen, metadata) => {
    if (disabled) {
      return setIsMenuOpen(false);
    } else if (metadata.source !== 'select') {
      setIsMenuOpen(isOpen);
    }
  };

  return (
    <Dropdown
      aria-hidden={hidden}
      hidden={hidden}
      ref={dropdownRef}
      show={isMenuOpen}
      id={`dropdown-${id}`}
      className={className}
      onToggle={onToggle}
    >
      <Dropdown.Toggle
        id="dropdown-toogle"
        className={`w-100 dropdown-search form-control ${selectedText} ${errorClass}`}
        variant="outline-link"
      >
        {icon && <span className="material-icons-outlined mr-2">{icon}</span>}
        <span className="w-90 text-truncate text-left">{searchTitle}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className={`border border-1 overflow-auto w-100`}>
        <Col xs={12}>
          <Form.Control
            type="text"
            onChange={onChange}
            onClick={(e) => e.stopPropagation()}
            placeholder={title}
          />
        </Col>

        <List className="dropdown-results pt-2 pl-3 px-3">
          {data?.map((item) => (
            <Dropdown.Item
              className="p-2 item-btn rounded w-100 tr-hover cursor-pointer"
              id={`item-${item.id}`}
              key={`item-${item.id || item.name}`}
              data-testid={`item-${item.id}`}
              onClick={(e) => handleSelect(e, item)}
            >
              <div className="user-avatar-select w-100">
                {bulletPoints && (
                  <div
                    className={`ml-3 rounded-circle bullet-color`}
                    style={{
                      background: tagsColorNormal[item.name],
                    }}
                  />
                )}
                {showAvatar && (
                  <ItemAvatar>
                    <Avatar user={item} />
                  </ItemAvatar>
                )}

                {bodyIcon && (
                  <span className="material-icons-outlined mr-2">{icon}</span>
                )}
                <ItemName
                  itemIcon={item?.icon}
                  showIcon={showIcon}
                  name={
                    customTitle
                      ? item[customTitle] +
                        (withData ? ` (${item?.organization?.name})` : '') +
                        (extraTitles &&
                        extraTitles.filter((i) => item[i]).length
                          ? ` (${extraTitles.map((i) => item[i]).join(' ')})`
                          : '')
                      : `${item.first_name} ${item.last_name}`
                  }
                />
              </div>
            </Dropdown.Item>
          ))}
        </List>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default IdfDropdownSearch;
