import React from 'react';
import { Spinner } from 'reactstrap';
import TooltipComponent from '../lesson/Tooltip';
import MaterialIcon from './MaterialIcon';

const ButtonIcon = ({
  onclick,
  label = 'Default',
  icon = '',
  loading = false,
  color = 'primary',
  classnames = '',
  tooltip,
  ...restProps
}) => {
  const ChargeLoad = () => {
    if (loading) return <Spinner className="spinner-grow-xs" />;

    return (
      <>
        {icon && (
          <i
            className={`material-icons-outlined ${label ? 'mr-1' : ''}`}
            data-uw-styling-context="true"
          >
            {icon}
          </i>
        )}
        {label}
        {tooltip && (
          <TooltipComponent title={tooltip}>
            <MaterialIcon icon="info" filled clazz="ml-1 fs-6 cursor-pointer" />
          </TooltipComponent>
        )}
      </>
    );
  };

  const btnClass = `btn btn-${color} ${classnames}`;

  return (
    <button
      className={btnClass}
      data-toggle="modal"
      onClick={onclick}
      {...restProps}
    >
      <ChargeLoad />
    </button>
  );
};

export default ButtonIcon;
