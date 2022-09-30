import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

const IdfDropdownSelect = ({ list, icon, onHandleChange, value, cssClass }) => {
  const [filter, setFilter] = useState(value || list[0]);

  const onSelect = (item) => {
    setFilter(item);
    onHandleChange(item);
  };

  return (
    <Dropdown className={cssClass}>
      <Dropdown.Toggle className="btn btn-ghost-primary">
        {icon && <span className="material-icons-outlined">{icon}</span>}
        <span className="fw-bold ml-2 text-capitalize">{filter}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: '145px' }}>
        {list?.map((item) => (
          <Dropdown.Item
            key={item}
            className="d-flex align-items-center"
            onClick={() => onSelect(item)}
            active={filter === item}
          >
            <h5 className="mb-0 text-capitalize">{item}</h5>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

IdfDropdownSelect.defaultProps = {
  list: [],
  onHandleChange: () => {},
  value: '',
  cssClass: '',
};

export default IdfDropdownSelect;
