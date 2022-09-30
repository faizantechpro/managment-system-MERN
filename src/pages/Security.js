import React from 'react';

import Heading from '../components/heading';
import ChangePassword from '../components/security/ChangePassword';

function Security() {
  return (
    <>
      <Heading title="Security" useBc />
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <ChangePassword />
        </div>
      </div>
    </>
  );
}

export default Security;
