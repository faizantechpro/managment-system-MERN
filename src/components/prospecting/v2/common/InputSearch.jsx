import React, { useEffect, useState } from 'react';

import DropdownWrapper from './DropdownWrapper';
import _ from 'lodash';
import { useFilterProspectContext } from '../../../../contexts/filterProspectContext';

const LocationSearch = ({
  name,
  data = [],
  setData,
  keyType,
  keyFilter,
  list,
  placeholder,
  limit = 5,
  onEnter,
  showLabelColon = true,
  customKey,
}) => {
  const [options, setOptions] = useState(list.slice(0, limit));
  const [selects, setSelects] = useState(data[keyType][keyFilter] || []);
  const { globalFilters, globalFiltersCompany } = useFilterProspectContext();
  const [refresh, setRefresh] = useState(0);

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

  const onHandleChange = (value) => {
    const result = list.filter((item) => {
      if (!_.isObject(item)) {
        return (
          item.toLowerCase().indexOf(value.toLowerCase()) > -1 &&
          !selects.includes(item)
        );
      } else {
        const newValue = item?.value;
        return (
          item?.value.toLowerCase().indexOf(newValue.toLowerCase()) > -1 &&
          !selects.includes(newValue)
        );
      }
    });

    // for list of objects don't update original list
    !customKey && setOptions(result.slice(0, limit));
  };

  const onHandleSelect = (item) => {
    let newItems = [...selects];
    if (_.isObject(item)) {
      newItems = [...newItems, item.value];
    } else {
      newItems = [...newItems, item];
    }
    updateData(newItems);
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
  };

  useEffect(() => {
    onEnter();
  }, [refresh]);

  useEffect(() => {
    if (_.isEmpty(globalFilters)) {
      setSelects([]);
    }
  }, [globalFilters]);

  useEffect(() => {
    if (_.isEmpty(globalFiltersCompany)) {
      setSelects([]);
    }
  }, [globalFiltersCompany]);

  useEffect(() => {
    try {
      setSelects(data[keyType][keyFilter] || []);
    } catch (e) {}
  }, [data]);

  return (
    <>
      {name && (
        <div className="mt-2 mb-2 text-capitalize font-weight-semi-bold fs-7">
          {name}
          {showLabelColon && <span>:</span>}
        </div>
      )}
      <DropdownWrapper
        placeholder={placeholder}
        onChange={onHandleChange}
        onSelect={onHandleSelect}
        options={options}
        selects={selects}
        customKey={customKey}
        onRemoveSelect={onHandleRemoveSelect}
        onClear={onHandleClear}
      />
    </>
  );
};

export default LocationSearch;
