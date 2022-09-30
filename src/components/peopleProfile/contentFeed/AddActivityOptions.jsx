import { useState, cloneElement, useEffect } from 'react';
import { capitalize } from 'lodash';

import TagInput from '../../tagInput/TagInput';

const ActivityLink = ({ children, onClick, name, variantOptions }) => (
  <span
    className={`text-primary cursor-pointer d-flex  ${
      variantOptions ? 'ml-3 mr-2 mb-4 pt-2' : ''
    }`}
    onClick={() => onClick({ name })}
  >
    {children}
  </span>
);

const AddActivityOptions = (props) => {
  const {
    searchGuest,
    tagifyDropdownlist,
    regex,
    tagifyValue,
    setAnotherGuests,
    setTagifyValue,
    constants,
    setBadEmail,
    expand,
    isOpen,
  } = props;

  const options = {
    participants: {
      icon: 'people',
      component: (
        <div className="ml-1">
          <TagInput
            dropdownList={tagifyDropdownlist}
            regex={regex}
            placeholder="Add Contacts"
            value={tagifyValue}
            setValue={(e) => {
              setAnotherGuests([]);
              setTagifyValue(e);
            }}
            tooltip={constants.tooltipTagInput}
            labelSize="full"
            onChange={(e) => searchGuest(e)}
            setBadEmail={setBadEmail}
            icon="person"
          />
        </div>
      ),
    },
  };

  const [variantOptions, setVariantOptions] = useState(false);
  const [activeOptions, setActiveOptions] = useState({});

  const changeVariant = ({ name }) => {
    setActiveOptions({ ...activeOptions, [name]: true });
    setVariantOptions(true);
  };

  const renderOptions = (item) => {
    const optionSelected = activeOptions[item];

    if (isOpen || optionSelected)
      return (
        <div className="position-relative">
          <div
            className="material-icons-outlined pos-icon-schedule"
            style={{ opacity: 0.5 }}
          ></div>
          {cloneElement(options[item].component)}
        </div>
      );

    return (
      <div className="position-relative">
        {variantOptions && (
          <div className="material-icons-outlined pos-icon-schedule">
            <span className="mb-4" style={{ opacity: 0.5 }}>
              {options[item].icon}
            </span>
          </div>
        )}
        <ActivityLink
          name={item}
          onClick={changeVariant}
          variantOptions={variantOptions}
        >
          {capitalize(item)}
          {!variantOptions}
        </ActivityLink>
      </div>
    );
  };

  useEffect(() => {
    if (tagifyValue?.length && expand) {
      changeVariant({ name: 'participants' });
    }
  }, [expand]);

  return (
    <div
      className={`position-relative ml-1 ${
        variantOptions || isOpen ? 'd-block' : 'd-flex'
      } `}
    >
      {!isOpen && !variantOptions && (
        <div className="d-flex align-items-center position-relative">
          <span
            className="material-icons-outlined pos-icon-schedule more-activity pr-2"
            style={{ opacity: 0.5 }}
          >
            more_horiz
          </span>
          <span className="">Add&nbsp;</span>
        </div>
      )}

      {Object.keys(options)?.map((opt) => {
        return <div key={opt}>{renderOptions(opt)}</div>;
      })}
    </div>
  );
};

export default AddActivityOptions;
