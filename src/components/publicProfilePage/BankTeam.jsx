import { useState } from 'react';

import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import SimpleModalCreation from '../modal/SimpleModalCreation';
import BankTeamTable from './BankTeamTable';

const BankTeam = ({ children, open, setOpenBankTeam, organizationId }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const onClose = () => {
    setOpenBankTeam(false);
  };

  const mouseEventClick = () => document.dispatchEvent(new MouseEvent('click'));

  return (
    <>
      {children}

      <SimpleModalCreation
        modalTitle="Your Bank Team"
        open={open}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        onClick={mouseEventClick}
        customModal="modal-dialog-custom modal-compact"
        headerClassName="font-weight-bolder"
        toggle={onClose}
        bankTeam
      >
        <BankTeamTable organizationId={organizationId} />
      </SimpleModalCreation>

      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
        <Alert
          color="warning"
          message={warningMessage}
          setMessage={setWarningMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default BankTeam;
