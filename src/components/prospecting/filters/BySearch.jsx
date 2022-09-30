import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

import DropdownSimple from '../../commons/DropdownSimple';
import ListItems from './ListItems';
import { capitalize } from '../../../utils/Utils';

const BySearch = ({
  data,
  setData,
  keyFilter,
  label,
  keyType,
  itemsFilter = [],
  typeCheck,
}) => {
  const [list, setList] = useState(itemsFilter.slice(0, 5));
  const selects = data[keyType][keyFilter];

  const updateData = (newData = []) => {
    const newFilter = {
      ...data,
      [keyType]: {
        ...data[keyType],
        [keyFilter]: newData,
      },
    };

    setData(newFilter);
  };

  const onChangeSelect = (e) => {
    const { value } = e.target;

    const result = itemsFilter.filter((item) => {
      return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
    });

    setList(result.slice(0, 5));
  };

  const onHandelSelect = (value) => {
    updateData([...selects, value]);
  };

  const onHandleRemoveSelect = (value) => {
    const items = selects.slice();
    const index = items.findIndex((item) => {
      return item.toLowerCase() === value.toLowerCase();
    });

    items.splice(index, 1);

    updateData(items);
  };

  const clearInputSearch = () => {
    const inputMenu = document.getElementById(
      `selectDropdown-${keyType}-${keyFilter}`
    );

    if (inputMenu) {
      inputMenu.value = '';

      onChangeSelect({ target: inputMenu });
    }
  };

  const onHandleClear = () => {
    clearInputSearch();
    updateData();
  };

  useEffect(() => {
    if (selects?.length === 0) {
      clearInputSearch();
    }
  }, [selects]);

  return (
    <div className="pt-2">
      <Form.Group>
        <Form.Label className="fw-normal">Enter or select {label}</Form.Label>
        <DropdownSimple
          id={`selectDropdownSimple-${keyType}-${keyFilter}`}
          name={`selectDropdown-${keyType}-${keyFilter}`}
          title={`${capitalize(label)} name`}
          placeholder={`${capitalize(label)} name`}
          value={''}
          results={list}
          error={''}
          selection={selects}
          setSelection={onHandelSelect}
          onChange={onChangeSelect}
          onDeleteLesson={onHandleRemoveSelect}
          typeCheck={typeCheck}
        />
      </Form.Group>
      <ListItems
        items={selects}
        deleteItem={onHandleRemoveSelect}
        onClear={onHandleClear}
      />
    </div>
  );
};

export default BySearch;
