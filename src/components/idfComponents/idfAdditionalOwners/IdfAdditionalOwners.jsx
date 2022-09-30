import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '../../Alert/Alert';
import AlertWrapper from '../../Alert/AlertWrapper';
import IdfAdditionalOwnersList from './IdfAdditionalOwnersList';

const IdfAdditionalOwners = (props) => {
  const { organizationId, contactId, id: dealId } = useParams();

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const id = organizationId || contactId || dealId;

  return (
    <div>
      <IdfAdditionalOwnersList
        {...props}
        serviceId={id}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      />

      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
      </AlertWrapper>
    </div>
  );
};

export default IdfAdditionalOwners;
