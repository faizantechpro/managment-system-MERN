import React from 'react';
import ButtonIcon from '../../../commons/ButtonIcon';
import MaterialIcon from '../../../commons/MaterialIcon';

const TableSelectedCount = ({
  list,
  containerPadding = 'p-0',
  btnLabel,
  btnIcon,
  btnClick,
  btnClass,
  btnColor,
  loading,
  onClear,
  customButton,
}) => {
  return (
    <div className={`text-end ${containerPadding} pt-0`}>
      <div className="d-flex justify-content-end align-items-center">
        <div className="d-flex align-items-center bg-primary rounded-lg p-1 mr-2">
          <span
            className={`fs-8 font-weight-semi-bold text-white text-capitalize pl-2 ${
              !onClear ? 'pr-2' : ''
            }`}
          >{`${list.length} Selected`}</span>
          {onClear && (
            <a
              href="#!"
              onClick={onClear}
              className="text-white text-hover-gray-dark ml-1 pr-1"
            >
              <MaterialIcon icon="close" />
            </a>
          )}
        </div>
        {customButton || (
          <ButtonIcon
            icon={btnIcon}
            onclick={btnClick}
            label={btnLabel}
            classnames={btnClass}
            color={btnColor}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default TableSelectedCount;
