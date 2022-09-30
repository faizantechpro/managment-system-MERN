import { useState } from 'react';

import {
  AFFIRMATIVE_ANSWER,
  TEXT_INFO_REMOVE_FILE,
} from '../../../utils/constants';
import AlertWrapper from '../../Alert/AlertWrapper';
import Alert from '../../Alert/Alert';
import ModalConfirmDefault from '../../modal/ModalConfirmDefault';

const DeleteFile = ({
  id,
  children,
  confirmOpen,
  setConfirmOpen,
  successMessage,
  setSuccessMessage,
  errorMessage,
  setErrorMessage,
  setRefreshRecentFiles,
  getFiles,
  removeFile,
}) => {
  const [loading, setLoading] = useState(false);

  const toggle = () => setConfirmOpen(!confirmOpen);

  const onRemoveFile = async () => {
    setLoading(true);

    await removeFile({
      id,
      setOpen: setConfirmOpen,
      setErrorMessage,
      setSuccessMessage,
      setRefreshRecentFiles,
      getFiles,
    });

    setLoading(false);
  };

  return (
    <>
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <ModalConfirmDefault
        open={confirmOpen}
        onHandleConfirm={onRemoveFile}
        onHandleClose={toggle}
        textBody={TEXT_INFO_REMOVE_FILE}
        labelButtonConfirm={AFFIRMATIVE_ANSWER}
        iconButtonConfirm="people"
        colorButtonConfirm={'outline-danger'}
        icon="report_problem"
        loading={loading}
      />
      {children}
    </>
  );
};

export default DeleteFile;
