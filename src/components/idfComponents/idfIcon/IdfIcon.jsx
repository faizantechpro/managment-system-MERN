import React from 'react';

const IdfIcon = ({ icon, className, style }) => {
  return (
    <span className={`material-icons-outlined ${className}`} style={style}>
      {icon}
    </span>
  );
};

IdfIcon.defaultProps = {
  icon: '',
  className: '',
};

export default IdfIcon;
