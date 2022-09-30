import MaterialIcon from './MaterialIcon';
import React from 'react';

const ValidationErrorText = ({ text, extraClass }) => {
  return (
    <p className={`text-danger fs-8 mt-1 ${extraClass}`}>
      {' '}
      <MaterialIcon icon="warning" /> {text}
    </p>
  );
};

export default ValidationErrorText;
