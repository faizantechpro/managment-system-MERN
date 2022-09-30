import MaterialIcon from './MaterialIcon';
import React from 'react';

const NoDataFound = ({
  title,
  description,
  icon,
  iconStyle = 'font-size-4em',
  iconFilled,
  containerStyle = 'py-6 my-6',
}) => {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center ${containerStyle}`}
    >
      {icon && (
        <MaterialIcon
          icon={icon}
          clazz={`${iconStyle} mb-1`}
          filled={iconFilled}
        />
      )}
      <h3 className="font-weight-medium">{title}</h3>
      <p className="font-weight-normal font-italic mb-0">{description}</p>
    </div>
  );
};

export default NoDataFound;
