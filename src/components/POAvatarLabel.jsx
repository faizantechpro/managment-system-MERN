import React from 'react';

// this component shows single letter O/P with Avatar
const POAvatarLabel = ({ isPrimaryOwner }) => {
  return (
    <>
      {isPrimaryOwner && (
        <>
          <span
            className="avatar-label avatar-primary-label"
            style={{ left: '30%' }}
          >
            P
          </span>
          <span
            className="avatar-label avatar-secondary-label"
            style={{ left: 27 }}
          >
            O
          </span>
        </>
      )}
      {!isPrimaryOwner && (
        <span className="avatar-label avatar-secondary-label">O</span>
      )}
    </>
  );
};

export default POAvatarLabel;
