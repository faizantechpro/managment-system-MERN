import React from 'react';

const FormSelect = (props) => {
  const {
    id,
    name,
    placeholder,
    value,
    searchInputPlaceholder,
    items,
    onChange,
  } = props;

  return (
    <select
      className="js-select2-custom custom-select select2-hidden-accessible"
      id={id}
      size="1"
      data-hs-select2-options={`{ "placeholder": ${placeholder}, "searchInputPlaceholder": ${searchInputPlaceholder} }`}
      data-select2-id={id}
      aria-hidden="true"
      name={name}
      onChange={onChange}
      value={value}
    >
      <option label="empty" data-select2-id="130"></option>
      {items.map((item, i) => (
        <option
          key={`${item.value}-${i + 1}`}
          value={item.value}
          selected=""
          data-select2-id={`${item.value}-${i + 1}`}
          data-uw-styling-context="true"
        >
          {item.title}
        </option>
      ))}
    </select>
  );
};

export default FormSelect;
