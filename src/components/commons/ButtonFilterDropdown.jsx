import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import MaterialIcon from './MaterialIcon';

// generic component to filter out table UI data, for ref check MyLessons.js and Training->My Favorites-> Filters top right button
const ButtonFilterDropdown = ({
  buttonText = 'Filters',
  options,
  handleFilterSelect,
  filterOptionSelected,
  btnToggleStyle = 'btn-sm',
  btnAddConfig,
}) => {
  const [openFilter, setOpenFilter] = useState(false);
  return (
    <Dropdown show={openFilter} onToggle={setOpenFilter}>
      <Dropdown.Toggle
        variant="white"
        className={`btn btn-white dropdown-toggle ${btnToggleStyle}`}
        id="dropdown-basic"
      >
        <div className="d-flex align-items-center">
          <MaterialIcon
            icon={filterOptionSelected?.icon || 'filter_list'}
            clazz="mr-1"
          />
          <p className="d-inline-block text-truncate mb-0 w-100">
            {filterOptionSelected.name || buttonText}
          </p>
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-0 py-2 min-w-250 idf-dropdown-item-list">
        {options.map((option) => (
          <Dropdown.Item
            key={option.id}
            href="#"
            onClick={(e) => handleFilterSelect(e, option)}
            className="px-3"
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                {option.icon && (
                  <MaterialIcon icon={option.icon} clazz="mr-2" />
                )}
                <span
                  className={
                    filterOptionSelected.key === option.key ? 'fw-bold' : ''
                  }
                >
                  {option.name}
                </span>
              </div>
              {filterOptionSelected.key === option.key && (
                <MaterialIcon icon="check" clazz="fw-bold" />
              )}
            </div>
          </Dropdown.Item>
        ))}
        {btnAddConfig && (
          <div className="idf-dropdown-item-list">
            <a
              className="btn-soft-light w-100 dropdown-item btn-block cursor-pointer py-2 mt-2 border-top"
              onClick={btnAddConfig.onClick}
            >
              <div className="d-flex align-items-center">
                <MaterialIcon icon={btnAddConfig.icon} clazz="mr-2" />
                <span>{btnAddConfig.text}</span>
              </div>
            </a>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ButtonFilterDropdown;
