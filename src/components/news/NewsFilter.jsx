import React from 'react';

const NewsFilter = ({ title, id, icon, active, setActive }) => {
  const value = '';

  return (
    <div
      className={`w-100 mb-2 ${
        active === id
          ? ''
          : `item-filter ${value?.trim() !== '' ? 'text-primary' : ''}`
      }`}
    >
      <div
        className={`d-flex cursor-pointer align-items-center p-item-filter font-size-sm2 font-weight-medium px-3 py-1 ${
          active === id ? 'bg-primary text-white' : ''
        }`}
        onClick={() =>
          setActive(id !== active ? { id: id, name: title } : null)
        }
      >
        <span
          className={`material-icons-outlined fs-20 py-1 ${
            active !== id && value?.trim() !== '' ? 'fw-bold' : ''
          }`}
        >
          {icon}
        </span>
        <div className="ml-1">
          <span
            className={`text-capitalize py-1 ${
              active !== id && value?.trim() !== '' ? 'fw-bold' : ''
            }`}
          >
            {title}
          </span>
          <br />
          {active !== id && value?.trim() !== '' && (
            <span className="fst-italic">{value}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsFilter;
