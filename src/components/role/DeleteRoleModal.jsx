import React, { useState } from 'react';
import { Spinner, Modal, ModalBody } from 'reactstrap';

import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.settings.roles.delete;

const ConfirmationModal = ({
  showModal,
  setShowModal,
  setSelectedRoles,
  event,
  selectedData,
  data,
  results,
  setResults,
  showReport,
  setShowReport,
  modified,
  setModified,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onHandleCloseModal = () => {
    setShowModal(false);
    showReport && setShowReport(false);
    results.length > 0 && setResults([]);
    setSelectedRoles([]);
    modified ? setModified(false) : setModified(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await event();
    setIsLoading(false);
  };

  const ConfirmationTitle = () => {
    return (
      <div className={`col text-center mb-3`}>
        <i className={`material-icons-outlined confirmation-icon mb-3`}>
          {`report_problem`}
        </i>
        <h4>{constants.confirm}</h4>
      </div>
    );
  };

  const validateBothReport = () => {
    const success = results.find((x) => x.result === constants.success);
    const failed = results.find((x) => x.result === constants.failed);
    if (success && failed) {
      return true;
    } else return false;
  };

  const bothReport = validateBothReport();
  const successReport = results.find((x) => x.result === constants.success);
  const failedReport = results.find((x) => x.result === constants.failed);

  return (
    <Modal
      isOpen={showModal}
      centered
      fade={false}
      className={`delete-role-modal`}
    >
      <ModalBody className={`p-5`}>
        {showReport
          ? results.length > 0 && (
              <>
                <div className={`col text-center mb-3`}>
                  <i
                    className={`material-icons-outlined font-size-5em mb-3 ${
                      bothReport
                        ? `text-warning`
                        : `${successReport ? `text-success` : ``}${
                            failedReport ? `text-danger` : ``
                          }`
                    }`}
                  >
                    {bothReport
                      ? `warning_amber`
                      : `${successReport ? `check_circle` : ``}${
                          failedReport ? `cancel` : ``
                        }`}
                  </i>
                  <h4>
                    {bothReport
                      ? constants.rolesWarning
                      : `${successReport ? constants.rolesDeleted : ``}${
                          failedReport ? constants.rolesNotRemoved : ``
                        }`}
                  </h4>
                </div>
                <ul className={`pl-4 pr-1`}>
                  {data &&
                    results?.map((item) => {
                      const success = item.result === constants.success;
                      return (
                        <li key={item.id}>
                          {`${data?.find((o) => o.id === item.id).name} `}
                          {(bothReport || !success) && <br />}
                          <i
                            className={`material-icons-outlined ${
                              success ? `text-success` : `text-danger`
                            }`}
                          >
                            {`${success ? `check_circle` : `cancel`}`}
                          </i>
                          {success ? (
                            bothReport && (
                              <span className={`text-success`}>
                                {` ${constants.deleted}`}
                              </span>
                            )
                          ) : (
                            <span
                              className={`text-danger`}
                            >{` ${item.msg}`}</span>
                          )}
                        </li>
                      );
                    })}
                </ul>
                <hr />

                <div>
                  <button
                    className="btn btn-primary px-3 btn-sm btn-block"
                    data-dismiss="modal"
                    onClick={onHandleCloseModal}
                  >
                    {constants.doneButton}
                  </button>
                </div>
              </>
            )
          : selectedData.length > 0 && (
              <>
                <ConfirmationTitle />
                <hr />
                <p>{constants.aboutToDelete}</p>
                <ul>
                  {data &&
                    selectedData.map((id) => (
                      <li key={id}>{data.find((o) => o.id === id).name}</li>
                    ))}
                </ul>
                <hr />
                <div className={`text-center row`}>
                  <div className={`col pl-3 pr-1`}>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm btn-block"
                      onClick={handleSubmit}
                    >
                      {isLoading ? (
                        <Spinner />
                      ) : (
                        <span>
                          <i className="material-icons-outlined">delete</i>
                          {constants.yesDelete}
                        </span>
                      )}
                    </button>
                  </div>
                  <div className={`col pl-1 pr-3`}>
                    <button
                      className="btn btn-primary btn-sm btn-block"
                      data-dismiss="modal"
                      onClick={onHandleCloseModal}
                    >
                      {constants.noCancel}
                    </button>
                  </div>
                </div>
              </>
            )}
      </ModalBody>
    </Modal>
  );
};

export default ConfirmationModal;
