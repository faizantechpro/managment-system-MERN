import React from 'react';

const CardWrapper = ({ children }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">{children}</div>
    </div>
  );
};

export default CardWrapper;
