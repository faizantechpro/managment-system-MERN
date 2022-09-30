import React from 'react';

const SelectDefault = (props) => {
  const {
    id,
    name,
    placeholder,
    value,
    searchInputPlaceholder,
    items,
    onChange,
    classnames,
  } = props;

  return (
    <select
      className={`js-select2-custom custom-select select2-hidden-accessible form-select ${classnames}`}
      id={id}
      size="1"
      data-hs-select2-options={`{ "placeholder": ${placeholder}, "searchInputPlaceholder": ${searchInputPlaceholder} }`}
      data-select2-id={id}
      tabIndex="-1"
      aria-hidden="true"
      name={name}
      onChange={onChange}
      value={value}
    >
      {placeholder && (
        <option value="-1" disabled>
          {placeholder}
        </option>
      )}
      {items?.map((item, i) => (
        <option
          key={`${item.value}-${i + 1}`}
          value={item.value}
          data-select2-id={`${item.value}-${i + 1}`}
          data-uw-styling-context="true"
        >
          {item.title}
        </option>
      ))}
    </select>
  );
};

export default SelectDefault;
