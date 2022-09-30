import { Col, Form, Dropdown } from 'react-bootstrap';

import Item from '../Item';
import List from '../List';
import stringConstants from '../../utils/stringConstants.json';
import { CardLabel } from '../layouts/ActivityLayout';
import Avatar from '../Avatar';
import { useState } from 'react';

const constants = stringConstants.components.DropdownSearchSelect;

const DropdownSearchSelect = ({
  id,
  onChange,
  onClick,
  name,
  placeholder,
  results,
  error,
  setSelection,
  selection,
  className,
  label,
  labelSize,
}) => {
  const [show, setShow] = useState(false);

  return (
    <CardLabel label={label} labelSize={labelSize}>
      <Dropdown
        show={show}
        onToggle={(isOpen, event, metadata) => {
          if (metadata.source !== 'select') {
            setShow(isOpen);
          }
        }}
        drop="down"
        className={`${className} pr-2`}
        onClick={onClick}
      >
        <Dropdown.Toggle
          className="w-100 dropdown-search py-2 mx-2"
          variant="outline-link"
          id="dropdown"
        >
          <Avatar classModifiers={`avatar-xs mr-2`} user={selection} />
          {selection?.name ? selection.name : constants.All}
        </Dropdown.Toggle>
        <Dropdown.Menu className="w-100" id={id}>
          <Col xs={12} className="px-3">
            {error?.error && (
              <p className="alert-danger px-3 py-1 mb-1 rounded">{error.msg}</p>
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
              {results?.map((item, index) => {
                return (
                  <div key={`${id}-${item.id}`}>
                    <Item
                      id={`${id}-${index}`}
                      onClick={() => {
                        setSelection(item);
                        setShow(false);
                      }}
                    >
                      <Avatar classModifiers={`avatar-xs mr-2`} user={item} />
                      {item.name}
                    </Item>
                    {item.name === constants.All && <hr className={`my-1`} />}
                  </div>
                );
              })}
            </List>
          </Col>
        </Dropdown.Menu>
      </Dropdown>
    </CardLabel>
  );
};

export default DropdownSearchSelect;
