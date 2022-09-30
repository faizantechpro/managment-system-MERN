import React, { useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const DefaultAvatar = ({
  active,
  classModifiers,
  defaultSize = 'sm',
  sizeIcon,
  type,
  style,
}) => {
  const [bgColor, setBgColor] = useState('#eeeeee');
  const [color, setColor] = useState('black');
  const renderAvatar = () => {
    return (
      <i
        className={`material-icons-outlined d-flex align-items-center ${
          sizeIcon || `avatar-icon-font-size-${defaultSize}`
        }`}
      >
        {type === 'contact' ? <AccountCircleIcon /> : 'business'}
      </i>
    );
  };

  const Color = '#d3d6de';
  const getColor = () => {
    setBgColor(Color);
    setColor('#7a8091');
  };

  useEffect(() => {
    getColor();
  }, []);

  return (
    <div
      style={style}
      className={`avatar avatar-${defaultSize} avatar-circle avatar-soft-primary ${classModifiers}`}
    >
      <span
        className={`avatar-initials ${sizeIcon || 'avatar-icon-font-size'}`}
        style={{ backgroundColor: `${bgColor}`, color: `${color}` }}
      >
        {renderAvatar()}
      </span>
      {active && (
        <span
          className={`avatar-status avatar-${defaultSize}-status avatar-status-success`}
        />
      )}
    </div>
  );
};

DefaultAvatar.defaultProps = {
  user: {},
  active: false,
  classModifiers: '',
  type: 'contact',
};

export default DefaultAvatar;
