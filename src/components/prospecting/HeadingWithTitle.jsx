import React from 'react';

const HeadingWithTitle = ({ title, children }) => {
  return (
    <div className={`page-header p-0`}>
      <div className="row d-flex align-items-end no-gutters">
        <div className="col-sm mb-sm-0"></div>
        {children}
      </div>
    </div>
  );
};

export default HeadingWithTitle;
