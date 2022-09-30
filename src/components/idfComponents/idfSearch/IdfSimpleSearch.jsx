import { useEffect } from 'react';
import { Dropdown, Form, Col } from 'react-bootstrap';

import Item from '../../Item';
import List from '../../List';

const IdfSimpleSearch = ({
  name,
  placeholder,
  data,
  onChange,
  value,
  onHandleSelect,
  startSearch = -1,
  onKeyDown,
  as,
  id,
  notFoundMessage,
}) => {
  useEffect(() => {
    if (as) {
      const element = document.getElementById(`dropdown-${id}`);

      element.classList.remove('btn-primary');
    }
  }, [as]);

  // if button gets focus, set focus on the underline input field, so that user can type and search
  const handleFocus = (e) => {
    e.target.querySelectorAll('input.form-control')[0]?.focus();
  };

  return (
    <Dropdown drop="down">
      <Dropdown.Toggle
        className="w-100 dropdown-search simple-search rounded"
        id={`dropdown-${id}`}
        onFocus={(e) => handleFocus(e)}
        onKeyDown={onKeyDown}
      >
        <Form.Control
          type="text"
          onChange={onChange}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value || ''}
        />
      </Dropdown.Toggle>
      {value?.length >= startSearch && (
        <Dropdown.Menu id="idf_address_street" className="w-100">
          <Col xs={12} className="px-3">
            <List className="dropdown-results">
              {data?.length > 0 ? (
                data?.map((item) => {
                  return (
                    <div key={`${item?.code || item.name}`}>
                      <Item
                        id={`${item.name}`}
                        onClick={(e) => {
                          onHandleSelect(e, item);

                          const dropdownMenu =
                            document.getElementById('idf_address_street');
                          dropdownMenu.classList.remove('show');
                        }}
                      >
                        {item.name}
                      </Item>
                    </div>
                  );
                })
              ) : (
                <Item>{notFoundMessage}</Item>
              )}
            </List>
          </Col>
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
};

export default IdfSimpleSearch;
