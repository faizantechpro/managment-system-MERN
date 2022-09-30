import React, { useState, useEffect } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';

import { ALL_LABEL, NO_DATA_YET } from '../utils/constants';
import { tagsColorNormal } from '../views/Deals/contacts/Contacts.constants';
import Item from './Item';
import ItemName from './ItemName';
import List from './List';

const ItemDefault = ({
  hideIcon,
  style,
  name,
  title,
  isSmall,
  onClick,
  className,
}) => {
  return (
    <Item id={`item-${title}`}>
      {!hideIcon && <div className={className} style={style} />}
      <ItemName name={name} bigmx={isSmall} onClick={onClick} />
    </Item>
  );
};

const ItemCustomField = ({ name, icon, description, last, onClick }) => {
  return (
    <Item
      onClick={onClick}
      id={`item-${name}`}
      className={`${!last ? 'border-bottom' : ''} py-3`}
    >
      <Row noGutters className="w-100">
        <Col xs={2} className="p-0 text-center">
          <span className="material-icons-outlined fs-4">{icon}</span>
        </Col>
        <Col xs={10}>
          <Col xs={12}>
            <h4>{name}</h4>
          </Col>
          <Col xs={12}>
            <p className="text-muted font-size-description-field">
              {description}
            </p>
          </Col>
        </Col>
      </Row>
    </Item>
  );
};

const DropdownSelect = (props) => {
  const [selectedTitle, setSelectedTitle] = useState('');

  const {
    data = [],
    onHandleSelect,
    selected,
    select,
    customTitle,
    allOption,
    anyOption,
    hideIcon = false,
    customClasses,
    placeholder,
    isSmall = false,
    typeMenu,
    group,
    hideSelection,
  } = props || {};

  const [show, setShow] = useState(false);

  const onSelect = (value, e) => {
    setShow(false);

    onHandleSelect(value, e);
  };

  const RenderItemList = ({ item, last }) => {
    switch (typeMenu) {
      case 'custom': {
        const { name, icon, description } = item;
        return (
          <ItemCustomField
            name={name}
            icon={icon}
            description={description}
            last={last}
            onClick={(e) => onSelect(item, e)}
          />
        );
      }
      default: {
        const { title, name } = item;
        return (
          <ItemDefault
            hideIcon={hideIcon}
            title={title}
            className={`mr-3 rounded-circle bullet-color`}
            name={customTitle ? item[customTitle] : title || name}
            bigmx={isSmall}
            onClick={(e) => onSelect(item, e)}
            style={{
              background: tagsColorNormal[name],
            }}
          />
        );
      }
    }
  };

  const onHandleToggle = (isOpen, event, metadata) => {
    if (metadata.source !== 'select') {
      setShow(isOpen);
    }
  };

  useEffect(() => {
    if (select) {
      const foundSeleted = data.find((item) => item.name === select);
      if (foundSeleted) {
        setSelectedTitle(foundSeleted.title);
      }
    }
  }, [select]);

  return (
    <Dropdown
      show={show}
      onToggle={onHandleToggle}
      drop="down"
      className={`border border-1 ${
        group ? 'rounded-top-right-1 rounded-bottom-right-1' : 'rounded'
      }`}
    >
      <Dropdown.Toggle
        className={`w-100 bg-white ${isSmall ? '' : 'dropdown-search'}  ${
          !select && placeholder ? 'text-muted' : 'text-black'
        } text-capitalize`}
        variant="outline-link"
        id="dropdown"
      >
        {selectedTitle || select || placeholder}
      </Dropdown.Toggle>

      {!hideSelection && (
        <Dropdown.Menu
          id="dropdown-menu-select"
          style={{ width: '!important' }}
          className={`${
            !customClasses ? 'w-50' : customClasses
          } border border-1`}
        >
          <Col xs={12} className="p-0 w-100">
            <List>
              {allOption && (
                <ItemDefault
                  className="rounded-circle bg-secondary pl-4"
                  name={ALL_LABEL}
                  onClick={() => onSelect(ALL_LABEL.toLowerCase())}
                />
              )}

              {anyOption && (
                <ItemDefault
                  className="rounded-circle bg-secondary"
                  name="any"
                  onClick={() => onSelect('any')}
                />
              )}

              {!data?.length && <ItemName name={NO_DATA_YET} />}

              {data
                ?.filter((i) =>
                  selected ? !Object.values(selected).includes(i) : i
                )
                ?.map((item, index) => (
                  <RenderItemList
                    key={index}
                    item={item}
                    last={index === data?.length - 1}
                  />
                ))}
            </List>
          </Col>
          {props.children}
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
};

export default DropdownSelect;
