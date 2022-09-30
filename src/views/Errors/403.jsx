import React from 'react';

const Unauthorized = () => {
  return (
    <>
      <div className="text-center exceptions-view">
        <h1>{`403`}</h1>
        <h3>{`We are sorry`}</h3>
        <p>{`You don’t have permission to access this resource.`}</p>
      </div>
    </>
  );
};

export default Unauthorized;
