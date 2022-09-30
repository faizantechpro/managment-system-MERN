import React from 'react';

// this component shows full form of P/O when hover on followers' section in Org profile
const POFullLabel = ({ isPrimaryOwner }) => {
  return (
    <div className="mt-1">
      {isPrimaryOwner && (
        <div className="d-flex align-items-center">
          <span className="badge d-inline-block p-2 rounded-lg avatar-primary-label text-white mr-1">
            Primary
          </span>
          <span className="badge d-inline-block p-2 rounded-lg avatar-secondary-label text-white">
            Owner
          </span>
        </div>
      )}
      {!isPrimaryOwner && (
        <span className="badge d-inline-block rounded-lg p-2 avatar-secondary-label text-white">
          Owner
        </span>
      )}
    </div>
  );
};

export default POFullLabel;
