import React, { useState } from 'react';
import { Card, Dropdown, Form } from 'react-bootstrap';

import ItemFilter from './ItemFilter';
import { stepItems } from './steps';

const CustomToggle = React.forwardRef(
  ({ children, onClick, onHandleClear, active }, ref) => {
    return (
      <span
        className={`d-flex w-100  ${active ? 'text-primary' : ''}`}
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
        {active && (
          <div className="ml-auto">
            <span className="material-icons-outlined">edit</span>
            <span className="material-icons-outlined" onClick={onHandleClear}>
              clear
            </span>
          </div>
        )}
      </span>
    );
  }
);
CustomToggle.displayName = 'CustomToggle';

const CustomMenu = React.forwardRef(
  ({ children, title, subName, style, className, onHandleDone, id }, ref) => {
    return (
      <Card ref={ref} style={style} className={className} id={id}>
        <Card.Header className="py-2 fs-6">
          <span>{subName || title}</span>
          <button onClick={onHandleDone} className="btn btn-primary btn-sm">
            Filter
          </button>
        </Card.Header>
        <Card.Body className="px-0 py-2">
          <ul className="list-unstyled mb-0">
            {React.Children.toArray(children).map((child, key) => {
              return (
                <li key={key} className="px-3 py-2  cursor-auto">
                  {child}
                </li>
              );
            })}
          </ul>
        </Card.Body>
      </Card>
    );
  }
);
CustomMenu.displayName = 'CustomMenu';

const SubmenuDropdown = ({
  title,
  icon,
  subName,
  data,
  setData,
  validate,
  onClear,
  onHandleDone,
}) => {
  const [titleActive, setTitleActive] = useState(null);
  const active = validate(title);
  const [show, setShow] = useState(false);

  const onHandleSwitch = (e) => {
    const { checked } = e.target;
    const location_target = checked ? 'contact' : 'company';

    const newData = {
      ...data,
      location: {
        ...data.location,
        location_target,
      },
    };

    setData(newData);
  };

  const onDone = () => {
    setShow(false);
    onHandleDone();
  };

  return (
    <Dropdown
      show={show}
      onToggle={(isOpen, event, metadata) => {
        if (metadata.source !== 'select') {
          setShow(isOpen);
        }
      }}
      drop="right"
      className="w-100 dropdown-prospecting"
      id={`dropdown-custom-components-menu-${title}`}
    >
      <Dropdown.Toggle
        as={CustomToggle}
        onHandleClear={(e) => {
          onClear(title);
          e.stopPropagation();
        }}
        active={active}
      >
        <span className="mr-auto">
          <span className="material-icons-outlined mr-2 nav-icon">{icon}</span>
          {title}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu
        as={CustomMenu}
        onHandleDone={onDone}
        subName={subName}
        id={`dropdown-custom-components-submenu-${title}`}
        title={title}
        className="ml-3 rounded-0 min-width-22 cursor-auto"
      >
        {title === 'Location' && data.global.type === 'contact' && (
          <div className="fw-normal">
            <Form.Check
              type="switch"
              checked={data.location.location_target !== 'company'}
              id="custom-switch"
              onChange={onHandleSwitch}
              label={`By contact Location`}
            />
            <p className="mt-1">
              {`You're currently filtering by ${data.location.location_target} location. To filter by contact location, please toggle right.`}
            </p>
          </div>
        )}

        {Array.isArray(stepItems[title.toLowerCase()]) ? (
          stepItems[title.toLowerCase()].map((item, key) => {
            const { component, name } = item;

            return (
              <ItemFilter
                key={key}
                title={name}
                active={titleActive}
                setActive={setTitleActive}
              >
                {React.cloneElement(component, { data, setData })}
              </ItemFilter>
            );
          })
        ) : (
          <div>
            {React.cloneElement(stepItems[title.toLowerCase()], {
              data,
              setData,
            })}
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SubmenuDropdown;
