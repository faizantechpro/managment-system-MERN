import React, { useState, useEffect } from 'react';
import { Spinner, Modal, ModalBody } from 'reactstrap';

import contactService from '../../services/contact.service';
import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.deleteConfirmationModal;

const DeleteConfirmationModal = ({
  showModal,
  setShowModal,
  handleSubmit,
  selectedData,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [relations, setRelations] = useState(undefined);

  const onHandleCloseModal = () => {
    setShowModal(false);
  };

  const checkRelations = async () => {
    setIsLoading(true);
    const { relations } = await contactService.checkRelations(selectedData);
    setRelations(relations);
    setIsLoading(false);
  };

  const renderConfirmationIcon = (icon, classModifier) => (
    <div className="container">
      <div className="row">
        <div className="col text-center ">
          <i
            className={`material-icons-outlined confirmation-icon ${classModifier}`}
          >
            {icon}
          </i>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (selectedData && showModal === true) {
      checkRelations();
    }
  }, [showModal]);

  return (
    <Modal isOpen={showModal} fade={false} size="sm">
      <ModalBody>
        {isLoading && relations ? (
          <Spinner />
        ) : (
          <>
            {renderConfirmationIcon('report_problem')}
            <h3>{constants.deleteContactTitle}</h3>
            <hr />
            <ul>
              <li>{relations?.deals || 0} Deals</li>
            </ul>
            <hr />
            <div className="text-right">
              <button
                type="button"
                className="btn btn-outline-danger mr-2"
                onClick={handleSubmit}
              >
                <span>
                  <i className="material-icons-outlined">delete</i>
                  {constants.deleteButton}
                </span>
              </button>
              <button
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={onHandleCloseModal}
              >
                {constants.cancelButton}
              </button>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default DeleteConfirmationModal;
