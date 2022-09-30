import React from 'react';

// generic component to show material/google icons wherever we want to use
const MaterialIcon = ({ icon, clazz, filled, ...rest }) => {
  return (
    <i
      {...rest}
      className={`${
        filled ? 'material-icons' : 'material-icons-outlined'
      } ${clazz}`}
    >
      {icon}
    </i>
  );
};

export default MaterialIcon;
