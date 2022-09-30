import React from 'react';

function SelectLanguage(props) {
  const { id, name, value, placeholder, items, onChange } = props;

  return (
    <select
      className="js-select2-custom custom-select select2-hidden-accessible"
      size="1"
      // style="opacity: 0;"
      id={id}
      data-hs-select2-options={`{ "minimumResultsForSearch": "Infinity", "placeholder": ${placeholder} }`}
      data-select2-id={id}
      tabIndex="-1"
      aria-hidden="true"
      name={name}
      onChange={onChange}
      value={value}
    >
      {items.map((item, idx) => (
        <option
          key={idx}
          value={item.value}
          selected=""
          data-option-template={`<span className="d-flex align-items-center"><img className="avatar avatar-xss avatar-circle mr-2" src="/assets/img/flags/1x1/us.svg" alt="Image description" width="16"/><span>${item.value}</span></span>`}
          data-select2-id="3"
          data-uw-styling-context="true"
        >
          {item.value}
        </option>
      ))}
    </select>
  );
}

export default SelectLanguage;
