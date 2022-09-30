import { Dropdown, Form, Col } from 'react-bootstrap';

import List from '../List';
import Item from '../Item';

const SimpleSearch = ({
  name,
  placeholder,
  data,
  onChange,
  value,
  onHandleSelect,
}) => {
  return (
    <Dropdown drop="down">
      <Dropdown.Toggle
        className="w-100 dropdown-search simple-search"
        // variant="outline-link"
        id="dropdown"
      >
        <Form.Control
          type="text"
          onChange={onChange}
          id={name}
          name={name}
          placeholder={placeholder}
          // results={results}
          maxLength={100}
          value={value}
          className="form-control"
        />
      </Dropdown.Toggle>
      {value.length > 2 && (
        <Dropdown.Menu className="w-100">
          <Col xs={12} className="px-3">
            {/* {error?.error && (
                <p className="alert-danger px-3 py-1 mb-1 rounded">
                  {error.msg}
                </p>
              )} */}

            <List className="dropdown-results">
              {data?.map((item, index) => {
                return (
                  <div key={`${item.name}`}>
                    <Item
                      id={`${item.name}`}
                      onClick={() => {
                        onHandleSelect(item);
                        // handleCollapse();
                      }}
                    >
                      {item.name}
                    </Item>
                  </div>
                );
              })}
            </List>
          </Col>
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
};

export default SimpleSearch;
