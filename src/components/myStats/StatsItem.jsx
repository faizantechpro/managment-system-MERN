import React from 'react';

const StatsItem = ({ icon, title, body }) => {
  return (
    <div className="media align-items-center">
      <i className="material-icons-outlined font-size-3xl text-primary mr-3">
        {icon}
      </i>
      <div className="media-body">
        <h5 className="d-block font-size-sm">{title}</h5>
        <div className="d-flex align-items-center">
          <h3 className="mb-0">{body}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatsItem;
