import React, { useState, useEffect } from 'react';
import { Spinner, Modal, ModalBody, ModalFooter } from 'reactstrap';

import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.deleteConfirmationModal;

const ConfirmationModal = ({
  showModal,
  setShowModal,
  setSelectedCategories,
  event,
  itemsConfirmation,
  itemsReport,
  clearSelection = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [failedReport, setFailedReport] = useState([]);

  const onHandleCloseModal = () => {
    setShowModal(false);
    setSelectedCategories([]);
    clearSelection();
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    await event();
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

  const validateReport = () => {
    setFailedReport(itemsReport.filter((item) => !item.isDeleted));
  };

  useEffect(() => {
    if (itemsReport.length > 0) {
      validateReport();
    }
  }, [itemsReport]);

  return (
    <Modal isOpen={showModal} fade={false} className={`delete-role-modal`}>
      <ModalBody>
        {itemsConfirmation.length > 0 && itemsReport.length === 0 && (
          <>
            {renderConfirmationIcon('report_problem')}
            <h4>{constants.confirmationMessage}</h4>
            <hr />
            <p>{constants.aboutToDelete}</p>
            <ul>
              {itemsConfirmation.map((item) => (
                <li key={item?.id}>{item?.title}</li>
              ))}
            </ul>
          </>
        )}

        {itemsReport.length > 0 && (
          <>
            {renderConfirmationIcon('check_circle', 'text-success')}
            <h4>
              {failedReport.length > 0
                ? constants.confirmationResultFailed
                : constants.confirmationResultSuccess}
            </h4>
            <p>{constants.details}</p>
            <ul>
              {itemsReport.map((item) => (
                <li key={item.id}>
                  {item.title}{' '}
                  <i
                    className={`material-icons-outlined ${
                      item.isDeleted ? 'text-success' : 'text-error'
                    }`}
                  >
                    {item.isDeleted ? 'done' : 'close'}
                  </i>
                </li>
              ))}
            </ul>
          </>
        )}
      </ModalBody>
      <ModalFooter className="flex-nowrap">
        {itemsConfirmation.length > 0 && itemsReport.length === 0 && (
          <>
            <button
              type="button"
              className="btn btn-sm w-50 btn-outline-danger"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <Spinner className="spinner-grow-xs" />
              ) : (
                <span>
                  <i className="material-icons-outlined">delete</i>
                  {constants.deleteButton}
                </span>
              )}
            </button>
            <button
              className="btn btn-sm w-50 btn-primary"
              data-dismiss="modal"
              onClick={onHandleCloseModal}
            >
              {constants.cancelButton}
            </button>
          </>
        )}

        {itemsReport.length > 0 && (
          <button
            className="btn btn-sm btn-block btn-primary"
            data-dismiss="modal"
            onClick={onHandleCloseModal}
          >
            {constants.okButton}
          </button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
