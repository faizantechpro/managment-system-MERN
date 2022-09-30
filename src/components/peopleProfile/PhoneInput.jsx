import React, { useState, useEffect } from 'react';

import DropdownSelect from '../DropdownSelect';

const maxPhones = 4;
const defaultLabels = [
  { key: 'phone_work', value: 'Work' },
  { key: 'phone_mobile', value: 'Mobile' },
  { key: 'phone_home', value: 'Home' },
  { key: 'phone_other', value: 'Other' },
];

const PhoneInput = ({ data, setInputs }) => {
  const [count, setCount] = useState(1);
  const [phoneInputs, setPhoneInputs] = useState(undefined);

  useEffect(() => {
    const dataPhones = {
      phone_work: data?.phone_work,
      phone_mobile: data?.phone_mobile,
      phone_home: data?.phone_home,
      phone_other: data?.phone_other,
    };

    if (dataPhones && Object.values(dataPhones).length > 0) {
      const newData = Object.entries(dataPhones).filter(([_, value]) => value);
      if (newData.length > 0) {
        setPhoneInputs(
          newData.map((item) => ({
            name: item[0],
            value: item[1],
            index: item[0],
          }))
        );
      }
    }
  }, [data]);

  useEffect(() => {
    if (!phoneInputs || phoneInputs.length === 0) {
      setPhoneInputs([
        {
          name: 'phone_1',
          value: '',
          index: defaultLabels[0].key,
        },
      ]);
    }
    updateGlobalForm();
  }, [phoneInputs]);

  const addInput = () => {
    setPhoneInputs((prev) => [
      ...prev,
      {
        name: `phone_${count + 1}`,
        value: '',
        index: defaultLabels[prev.length].key,
      },
    ]);
    setCount(count + 1);
  };

  const updateGlobalForm = () => {
    const defaultPhones = {
      phone_work: '',
      phone_mobile: '',
      phone_home: '',
      phone_other: '',
    };

    const newData = phoneInputs?.reduce((acc, item) => {
      acc[item.index] = item.value;
      return acc;
    }, defaultPhones);
    setInputs(newData);
  };

  const removeInput = (name) => {
    setCount(count + 1);
    const newInputs = phoneInputs.filter((input) => input.name !== name);
    setPhoneInputs(newInputs);
  };

  const handleChange = (event) => {
    const { name, value } = event?.target;
    setPhoneInputs(
      phoneInputs.map((input) => {
        if (input.name === name) {
          input.value = value;
        }
        return input;
      })
    );
  };

  const handleChangeSelect = (name, newItem) => {
    setPhoneInputs(
      phoneInputs.map((item) => {
        if (item.name === name) {
          item.index = newItem.name;
        }
        return item;
      })
    );
  };

  const getOptions = () => {
    return defaultLabels.map((item) => ({
      id: item.key,
      name: item.key,
      title: item.value,
    }));
  };

  return (
    <>
      <div className="form-group mb-0">
        <label htmlFor="phone">Phone</label>
        {phoneInputs &&
          phoneInputs?.map((input) => (
            <div
              className="input-group input-group-sm-down-break align-items-center show-on-hover"
              key={input.name}
            >
              <input
                className="form-control border-right-0 input-dropGroup"
                type="text"
                name={input.name}
                value={input.value.replaceAll(/[^\d-]/g, '')}
                placeholder="Phone"
                onChange={handleChange}
              />

              <div className="w-25">
                <DropdownSelect
                  isSmall
                  onHandleSelect={(selectedItem) => {
                    handleChangeSelect(input.name, selectedItem);
                  }}
                  data={getOptions()}
                  customTitle="title"
                  select={input.index}
                  group
                />
              </div>

              <span
                onClick={removeInput.bind(null, input.name)}
                className="material-icons-outlined text-danger remove-additional-field-icon"
              >
                clear
              </span>
            </div>
          ))}

        <button
          className="js-create-field form-link btn btn-sm btn-no-focus btn-ghost-primary"
          onClick={addInput}
          disabled={phoneInputs?.length >= maxPhones}
        >
          <i className="material-icons-outlined">add</i> Add Phone
        </button>
      </div>
    </>
  );
};

PhoneInput.defaultProps = {
  data: {
    phone_work: '',
    phone_mobile: '',
    phone_home: '',
    phone_other: '',
  },
};

export default PhoneInput;
