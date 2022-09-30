import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';

import stringConstants from '../../utils/stringConstants.json';
import IdfUploadFiles from '../idfComponents/idfUploadFiles/IdfUploadFiles';

const constants = stringConstants.modals.uploadFileModal;

const UploadFileModal = ({
  showModal,
  setShowModal,
  handleSubmit,
  setErrorMessage,
  publicPage,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileInput, setFileInput] = useState(undefined);

  const deleteFile = () => {
    setFileInput(undefined);
  };

  const onSubmit = () => {
    setIsLoading(true);
    handleSubmit(fileInput, setIsLoading);
  };

  useEffect(() => {
    if (showModal) {
      deleteFile();
      setIsLoading(false);
    }
  }, [showModal]);

  return (
    <Modal isOpen={showModal} fade={false}>
      <ModalHeader tag="h4">{constants.title}</ModalHeader>
      <ModalBody>
        <IdfUploadFiles
          fileInput={fileInput}
          setFileInput={setFileInput}
          deleteFile={deleteFile}
          setErrorMessage={setErrorMessage}
          publicPage={publicPage}
        />
      </ModalBody>

      <ModalFooter>
        <>
          <button
            className="btn btn-white"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </button>
          {isLoading ? (
            <Spinner />
          ) : (
            <button
              className="btn btn-primary"
              onClick={onSubmit}
              disabled={!fileInput}
            >
              Upload
            </button>
          )}
        </>
      </ModalFooter>
    </Modal>
  );
};

export default UploadFileModal;
