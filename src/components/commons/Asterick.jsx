import React from 'react';

const Asterick = ({ symbol = '*', className = 'text-danger' }) => {
  return <span className={className}>{symbol}</span>;
};

export default Asterick;
