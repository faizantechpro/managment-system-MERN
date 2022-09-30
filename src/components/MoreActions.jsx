import React from 'react';
import { Dropdown } from 'react-bootstrap';

const MoreActions = ({
  icon = 'more_vert',
  items,
  onHandleRemove,
  onHandleDownload,
  onHandleEdit,
  onHandleAdd,
  toggleClassName,
  ...restProps
}) => {
  const onClickFire = {
    remove: onHandleRemove,
    edit: onHandleEdit,
    add: onHandleAdd,
    download: onHandleDownload,
  };

  return (
    <Dropdown drop="down" className="idf-dropdown-item-list">
      <Dropdown.Toggle
        className={`${toggleClassName} add-more-btn rounded-circle dropdown-hide-arrow`}
        variant="outline-link"
        id="dropdown"
        {...restProps}
      >
        <span>
          <span className="material-icons-outlined">{icon}</span>
        </span>
      </Dropdown.Toggle>

      {items.length > 0 && (
        <Dropdown.Menu
          align="right"
          className="border border-1"
          style={{ width: '135px !important' }}
        >
          {items?.map((data) => (
            <Dropdown.Item
              key={data.id}
              className={data.className}
              onClick={onClickFire[data.id]}
            >
              <i
                className={`material-icons-outlined dropdown-item-icon ${data.className}`}
              >
                {data.icon}
              </i>
              {data.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
};

MoreActions.defaultProps = {
  toggleClassName: '',
};

export default MoreActions;
