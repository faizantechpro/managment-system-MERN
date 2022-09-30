import { useEffect, useState } from 'react';
import { Col, Form, Dropdown, InputGroup, Spinner } from 'react-bootstrap';

import Avatar from './Avatar';
import Item from './Item';
import ItemName from './ItemName';
import List from './List';
import ItemAvatar from './ItemAvatar';
import { ALL_LABEL } from '../utils/constants';

const SearchSpinner = () => (
  <InputGroup.Text
    role="span"
    style={{ top: '4px', right: '25px' }}
    className="border-0 pl-3 pr-0 position-absolute"
  >
    <Spinner animation="border" size="sm" variant="primary" />
  </InputGroup.Text>
);

const DropdownSearch = (props) => {
  const {
    data,
    error,
    onChange,
    onHandleSelect,
    name,
    customTitle,
    allOption,
    showAvatar = true,
    title,
    children,
    className,
    selected,
    customMenuClassName,
    disabled,
    search,
    createItem,
    loading,
    extraTitles,
    errorClass,
    placeholder,
    hideSearchBar,
  } = props;

  const [searchTitle, setSearchTitle] = useState(title);
  const [newItemSelect, setNewItemSelect] = useState(false);
  const titleDefault = title;
  const allTitles = ['organization', 'contact', 'dashboard'];

  const onSelectData = (item, name) => {
    setNewItemSelect(false);
    setSearchTitle(
      item[customTitle] ||
        item.name ||
        (item.first_name &&
          `${item.first_name} ${item.last_name && item.last_name}`) ||
        item.email
    );

    onHandleSelect(item, name);

    const dropdownMenu = document.getElementById(
      `dropdown-menu-search-${name}`
    );

    dropdownMenu.classList.remove('show');
  };

  const onAllData = (item, name) => {
    setSearchTitle(item);

    onHandleSelect(item, name);

    const dropdownMenu = document.getElementById(
      `dropdown-menu-search-${name}`
    );
    dropdownMenu.classList.remove('show');
  };

  useEffect(() => {
    if (typeof selected === 'string') {
      setSearchTitle(selected);
    }
    if (typeof selected === 'object' && selected[customTitle]) {
      setSearchTitle(selected[customTitle] || '');
    }
  }, [selected]);

  useEffect(() => {
    if (!selected && !(selected && !!selected[customTitle])) {
      setSearchTitle(title);
    }
  }, [title]);

  const selectedText = searchTitle !== title && 'text-black';

  return (
    <Dropdown
      drop="down"
      className={`rounded ${className}`}
      onToggle={(open) => !open && onChange()}
    >
      <Dropdown.Toggle
        className={`w-100 dropdown-search ${selectedText} ${errorClass}`}
        variant="outline-link"
        id="dropdown-autoclose-true"
        disabled={disabled}
      >
        <div className="d-flex items-baseline w-90 text-black">
          {searchTitle}
          {newItemSelect && (
            <div className="ml-auto">
              <span className="badge bg-primary text-white">NEW</span>
            </div>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu
        id={`dropdown-menu-search-${name}`}
        className={`border border-1 overflow-auto ${
          customMenuClassName || 'w-100 '
        }`}
      >
        <Col xs={12} className="px-3 position-relative">
          {error?.error && (
            <p className="alert-danger px-3 py-1 mb-1 rounded">{error.msg}</p>
          )}

          {!hideSearchBar && (
            <Form.Control
              type="text"
              onChange={onChange}
              id={name}
              name={name}
              data={data}
              placeholder={placeholder}
              maxLength={createItem ? -1 : 15}
              onClick={(e) => e.stopPropagation()}
              value={search}
            />
          )}
          {loading && <SearchSpinner />}
          <div className="mt-2 overflow-auto">
            <List className="dropdown-results">
              {allOption && (
                <Item id="item-all">
                  <div
                    className="user-avatar-select w-100"
                    onClick={() => onAllData(ALL_LABEL, name)}
                  >
                    <ItemName name={ALL_LABEL} />
                  </div>
                </Item>
              )}
              {data &&
                data?.map((item) => (
                  <Item
                    id={`item-${item.id}`}
                    key={`item-${item.id || item.name}`}
                  >
                    <div
                      className="user-avatar-select w-100"
                      onClick={() => onSelectData(item, name)}
                    >
                      {showAvatar && (
                        <ItemAvatar>
                          <Avatar user={item} />
                        </ItemAvatar>
                      )}

                      <ItemName
                        name={
                          customTitle
                            ? item[customTitle] +
                              (extraTitles &&
                              extraTitles.filter((i) => item[i]).length
                                ? `  (${extraTitles
                                    .map((i) => item[i])
                                    .join(', ')})`
                                : '')
                            : item.first_name || item.last_name
                            ? `${item.first_name} ${item.last_name}`
                            : item.email
                        }
                      />
                    </div>
                  </Item>
                ))}
            </List>

            {createItem && search?.trim() !== '' && (
              <div>
                <hr />
                <div
                  className="w-100 py-2 cursor-pointer"
                  onClick={() => {
                    const dropdownMenuEl = document.getElementById(
                      `dropdown-menu-search-${name}`
                    );
                    dropdownMenuEl.classList.remove('show');
                    const dropdownMenu = document.getElementById(name);
                    setSearchTitle(dropdownMenu.value);
                    setNewItemSelect(true);
                    createItem(dropdownMenu.value);
                  }}
                >
                  <h5 className="mb-0  text-primary">
                    <span className="material-icons-outlined">add</span> Add{' '}
                    {search} as new{' '}
                    {allTitles.find((i) => titleDefault.includes(i))}
                  </h5>
                </div>
              </div>
            )}
          </div>
        </Col>
        {children}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownSearch;
