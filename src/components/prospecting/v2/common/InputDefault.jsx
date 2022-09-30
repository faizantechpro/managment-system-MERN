import React, { useEffect, useState } from 'react';

import IdfFormInput from '../../../idfComponents/idfFormInput/IdfFormInput';
import ListItems from '../../filters/ListItems';
import _ from 'lodash';

const InputWrapper = ({
  name,
  placeholder,
  data,
  setData,
  keyType,
  keyFilter,
  onEnter,
  showLabelColon = true,
}) => {
  const [inputValue, setInputValue] = useState(data[keyType]);
  const [selects, setSelects] = useState([]);
  const [stopDataChange, setStopDataChange] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const onHandleChangeName = (e) => {
    const { value } = e.target;
    const inputKeyObject = {};
    inputKeyObject[keyFilter] = value;
    setInputValue(inputKeyObject);
    setStopDataChange(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onHandleSelect(event.target.value);
      setInputValue({});
    }
  };

  const updateData = (newData = []) => {
    const payload = {
      ...data,
      [keyType]: {
        ...data[keyType],
        [keyFilter]: newData,
      },
    };

    setSelects(newData);
    setData({ type: 'set', payload });
    setRefresh((prevState) => prevState + 1);
  };

  const onHandleSelect = (item) => {
    let newItems = [...selects];
    if (_.isObject(item)) {
      newItems = [...newItems, item.value];
    } else {
      newItems = [...newItems, item];
    }
    updateData(_.uniq(newItems));
  };

  const onHandleRemoveSelect = (value) => {
    const items = selects.slice();
    const index = items.findIndex((item) => {
      return item.toLowerCase() === value.toLowerCase();
    });

    items.splice(index, 1);
    updateData(items);
  };

  const onHandleClear = () => {
    updateData([]);
    setInputValue({});
  };

  useEffect(() => {
    try {
      if (!stopDataChange) {
        setSelects(data[keyType][keyFilter] || []);
      }
    } catch (e) {}
  }, [data]);

  useEffect(() => {
    onEnter();
  }, [refresh]);

  return (
    <div>
      {name && (
        <div className="mt-2 mb-2 text-capitalize font-weight-semi-bold">
          {name}
          {showLabelColon && <span>:</span>}
        </div>
      )}
      <IdfFormInput
        className="mb-0"
        inputClassName={'form-control'}
        placeholder={placeholder}
        value={inputValue}
        name={keyFilter}
        onChange={onHandleChangeName}
        onKeyPress={handleKeyPress}
      />

      {!!selects.length && (
        <ListItems
          items={selects}
          deleteItem={onHandleRemoveSelect}
          onClear={onHandleClear}
        />
      )}
    </div>
  );
};

export default InputWrapper;
