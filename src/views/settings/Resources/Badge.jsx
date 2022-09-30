import React, { useState } from 'react';

import Alert from '../../../components/Alert/Alert';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import Badge from '../../../components/badge/Badge';
import CreateBadge from '../../../components/badge/CreateBadge';

const BadgeView = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createMode, setCreateMode] = useState(false);
  const [id, setId] = useState('');

  return (
    <>
      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert message={successMessage} setMessage={setSuccessMessage} />
      </AlertWrapper>
      {createMode ? (
        <CreateBadge
          id={id}
          setId={setId}
          setCreateMode={setCreateMode}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />
      ) : (
        <Badge setCreateMode={setCreateMode} setId={setId} />
      )}
    </>
  );
};

export default BadgeView;
