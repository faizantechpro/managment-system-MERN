import React, { useState } from 'react';
import { Row, Col, Form, Dropdown } from 'react-bootstrap';

import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.settings.resources.courses;
const commons = stringConstants.global.commons;

const List = ({ children, className }) => {
  return (
    <Col xs={12} className={`px-0 mt-3 ${className}`}>
      {children}
    </Col>
  );
};

const ItemTitle = ({ title }) => {
  return (
    <Col sm={9} className="item-user">
      <h5 className="mb-0">{title}</h5>
    </Col>
  );
};

const ItemActions = ({ children, center }) => {
  return (
    <Col
      sm={3}
      className={`d-flex justify-content-end ${
        !center ? ' align-items-lg-center' : ''
      }`}
    >
      {children}
    </Col>
  );
};

const InputCheckedDefault = ({ name, onClick, checked }) => {
  return (
    <Form.Check name={name}>
      <Form.Check.Input
        className="cursor-pointer"
        onClick={onClick}
        id={`input-checked-${name}`}
        type="checkbox"
        checked={checked}
      />
    </Form.Check>
  );
};

const DropdownLesson = ({
  id,
  onChange,
  value,
  name,
  placeholder,
  results,
  error,
  selection,
  setSelection,
  title,
  children,
  onDeleteLesson,
  typeCheck = false,
}) => {
  const [show, setShow] = useState(false);

  return (
    <Dropdown
      show={show}
      onToggle={(isOpen, event, metadata) => {
        if (metadata.source !== 'select') {
          setShow(isOpen);
        }
      }}
      drop="down"
      className="border border-1 rounded"
    >
      <Dropdown.Toggle
        className="w-100 dropdown-search"
        variant="outline-link"
        id="dropdown"
      >
        {title}
      </Dropdown.Toggle>
      <Dropdown.Menu className="w-100" id={id}>
        <Col xs={12} className="px-3">
          {error.error && (
            <p className="alert-danger px-3 py-1 mb-1 rounded">{error.msg}</p>
          )}
          {typeCheck && (
            <div className="w-100 pb-1 pr-1 d-flex">
              <span
                className="text-muted cursor-pointer fs-5 ml-auto"
                onClick={() => setShow(false)}
              >
                &times;
              </span>
            </div>
          )}
          <Form.Control
            type="text"
            onChange={onChange}
            id={name}
            name={name}
            placeholder={placeholder}
            results={results}
            maxLength={100}
          />
          <List className="dropdown-results">
            {value.length > 1 && (
              <p className="alert-light mb-1 px-1 py-0 text-center rounded">
                {constants.labelAddLesson}
              </p>
            )}

            {results?.map((nick, index) => {
              const checked = selection?.some((item) => item === nick);

              return (
                <Row id={`item-${index}`} key={index} className="mt-2">
                  <ItemTitle title={nick} />
                  <ItemActions center={typeCheck}>
                    {!typeCheck && (
                      <p
                        className={`btn btn-sm btn-outline-${
                          !checked ? 'primary' : 'danger'
                        } mb-1 text-center rounded`}
                        onClick={() => {
                          if (!checked) {
                            setSelection(nick);
                          } else {
                            onDeleteLesson(nick);
                          }
                          setShow(false);
                        }}
                      >
                        {!checked ? commons.add : commons.remove}
                      </p>
                    )}

                    {typeCheck && (
                      <InputCheckedDefault
                        name={nick}
                        checked={checked}
                        onClick={() => {
                          if (!checked) {
                            setSelection(nick);
                          } else {
                            onDeleteLesson(nick);
                          }
                        }}
                      />
                    )}
                  </ItemActions>
                </Row>
              );
            })}
          </List>
        </Col>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownLesson;
