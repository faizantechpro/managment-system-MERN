import React from 'react';
import stringConstants from '../../../utils/stringConstants.json';
import ButtonIcon from '../../commons/ButtonIcon';
import _ from 'lodash';
import MaterialIcon from '../../commons/MaterialIcon';

const constants = stringConstants.global.commons;

const ListItems = ({ items, deleteItem, onClear, customKey, options }) => {
  const findKeyByValue = (value) => {
    if (options) {
      return _.find(options, { value })?.key;
    }
    return value;
  };
  return (
    <div className="mt-3 w-100" variant="flush">
      <div>
        {items?.map((item, index) => {
          return (
            <div
              className="tag-item rounded-lg align-items-center h-auto p-1 pl-2"
              key={index}
            >
              <span className="fw-normal fs-8 font-weight-semi-bold text-wrap">
                {customKey ? findKeyByValue(item) : item}
              </span>

              <button
                type="button"
                className="button ml-0"
                onClick={() => deleteItem(item)}
              >
                <MaterialIcon icon="close" />
              </button>
            </div>
          );
        })}
      </div>
      <ButtonIcon
        label={constants.clear}
        classnames="btn-sm my-2 fw-bold btn-block"
        color="outline-danger"
        onclick={onClear}
      />
    </div>
  );
};

export default ListItems;
