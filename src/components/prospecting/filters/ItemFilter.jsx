import React from 'react';
import { Collapse } from 'react-bootstrap';

const ItemFilter = ({ children, title, active, setActive }) => {
  const onHandleClickArrow = (e) => {
    e.preventDefault();
    setActive(active !== title ? title : null);
  };

  return (
    <div>
      <div
        key={title}
        className={`d-flex fw-normal cursor-pointer ${
          active === title ? 'text-primary' : 'text-muted'
        }`}
        onClick={onHandleClickArrow}
      >
        <span>{title}</span>
        <span className="material-icons-outlined ml-auto">
          {active !== title ? 'keyboard_arrow_right' : 'keyboard_arrow_down'}
        </span>
      </div>
      <Collapse in={active === title}>
        <div className={`border-3`}>{children}</div>
      </Collapse>
    </div>
  );
};

export default ItemFilter;
