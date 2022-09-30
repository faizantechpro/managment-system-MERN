import { Col, Form, Dropdown } from 'react-bootstrap';

import Avatar from '../../Avatar';
import Item from '../../Item';
import ItemAvatar from '../../ItemAvatar';
import List from '../../List';
import stringConstants from '../../../utils/stringConstants.json';

const commons = stringConstants.global.commons;

const ItemActions = ({ id, item, selection, setSelection, removeTag }) => {
  const checkUserAdded = selection.some((select) => select.id === item.id);
  const email = item.email_work || item.email_home || item.email_mobile;

  const handleCollapse = () => {
    const dropdownMenu = document.getElementById(id);
    dropdownMenu.classList.remove('show');
  };

  const onAddItem = () => {
    const itemToAdd = {
      id: item.id,
      name: `${item.first_name} ${item.last_name}`,
      email,
    };

    setSelection((selection) => [...selection, itemToAdd]);
    handleCollapse(item.id);
  };

  const renderChildren = () => {
    if (checkUserAdded) {
      return (
        <p
          className="btn btn-outline-danger mb-1 text-center rounded"
          onClick={() => removeTag(item.id)}
        >
          {commons.remove}
        </p>
      );
    }

    return (
      <p
        className="btn btn-outline-primary mb-1 text-center rounded"
        onClick={onAddItem}
      >
        {commons.add}
      </p>
    );
  };

  return (
    <Col sm={3} className="d-flex align-items-lg-center justify-content-end">
      {renderChildren()}
    </Col>
  );
};

const IdfDropdownSearchWithButtonSelect = (props) => {
  const {
    id,
    title,
    placeholder,
    name,
    data,
    showAvatar,
    customTitle,
    selection,
    setSelection,
    onChange,
    removeTag,
  } = props;

  const renderName = (item) => {
    return (
      <span>
        {customTitle
          ? item[customTitle]
          : `${item.first_name} ${item.last_name}`}
      </span>
    );
  };

  const ItemUser = ({ id, name, subName, itemName = '', item }) => {
    return (
      <Col sm={9} id={id} className="item-user d-flex">
        {showAvatar && (
          <div className="mr-4">
            <ItemAvatar>
              <Avatar user={item} />
            </ItemAvatar>
          </div>
        )}
        <div>
          <h5 className="mb-0">{name}</h5>
          <p className={`m-0 ${!subName ? 'text-danger' : ''} `}>
            {subName ? `${itemName} ${subName}` : 'No Associated Email'}
          </p>
        </div>
      </Col>
    );
  };

  return (
    <Dropdown drop="down" className="border border-1 rounded">
      <Dropdown.Toggle
        className="w-100 dropdown-search"
        variant="outline-link"
        id="dropdown"
      >
        {title}
      </Dropdown.Toggle>

      <Dropdown.Menu className={`border border-1 overflow-auto w-100 `} id={id}>
        <Col xs={12}>
          <Form.Control
            type="text"
            onChange={onChange}
            id={name}
            name={name}
            placeholder={placeholder}
            maxLength={100}
          />

          <List className="dropdown-results">
            {data?.map((item) => {
              const email =
                item.email_work || item.email_home || item.email_mobile;

              return (
                <Item id={`item-${item.id}`} key={`item-${item.id}`}>
                  <ItemUser
                    item={item}
                    name={renderName(item)}
                    subName={email}
                  />
                  {email && (
                    <ItemActions
                      id={id}
                      item={item}
                      selection={selection}
                      setSelection={setSelection}
                      removeTag={removeTag}
                    />
                  )}
                </Item>
              );
            })}
          </List>
        </Col>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default IdfDropdownSearchWithButtonSelect;
