import { DRAFT } from '../../utils/constants';
import React from 'react';

// will use this component wherever we want to display color statuses
const StatusLabel = ({ status }) => {
  const statusClasses = {
    published: 'bg-success',
    draft: 'bg-gray-dark',
    deleted: 'bg-danger',
    Yes: 'bg-success',
    No: 'bg-danger',
  };
  return (
    <span
      style={{ minWidth: 85, letterSpacing: '0.4px' }}
      className={`text-uppercase text-center text-white d-inline-block p-1 px-2 font-weight-semi-bold rounded-lg fs-9 ${statusClasses[status]}`}
    >
      {status || DRAFT}
    </span>
  );
};

export default StatusLabel;
