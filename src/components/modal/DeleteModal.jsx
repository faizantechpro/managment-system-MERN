import React, { useState } from 'react';
import { Spinner, Modal, ModalBody } from 'reactstrap';

const DeleteModal = ({
  showModal,
  setShowModal,
  selectedData,
  setSelectedData,
  event,
  data,
  results,
  setResults,
  showReport,
  setShowReport,
  modified,
  setModified,
  constants,
  type,
  resetSeletedData = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onHandleCloseModal = () => {
    setShowModal(false);
    showReport && setShowReport(false);
    results.length > 0 && setResults([]);
    resetSeletedData && setSelectedData([]);
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
    <Modal isOpen={showModal} fade={false} className={`delete-role-modal`}>
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
                      ? constants.warning
                      : `${successReport ? constants.hasBeenDeleted : ``}${
                          failedReport ? constants.notRemoved : ``
                        }`}
                  </h4>
                </div>
                <ul className={`pl-4 pr-1`}>
                  {data &&
                    results?.map((item) => {
                      const success = item.result === constants.success;
                      let description;

                      if (type === 'contacts') {
                        const firstName =
                          data?.find((o) => o.id === item.id).first_name || '';
                        const lastName =
                          data?.find((o) => o.id === item.id).last_name || '';
                        const name = `${firstName} ${lastName}`;
                        const title =
                          data?.find((o) => o.id === item.id).title || null;
                        description = `${name}${title ? ` - ${title}` : ''} `;
                      } else if (type === 'organizations') {
                        description =
                          data?.find((o) => o.id === item.id).name || '';
                      } else if (type === 'groups') {
                        description =
                          data?.find((o) => o.id === item.id).name || '';
                      }

                      return (
                        <li key={`delete-result-${item.id}`}>
                          {description}
                          {(bothReport || !success) && <br />}

                          {item.msg.split(',').map((msg) => (
                            <div key={msg}>
                              <i
                                className={`material-icons-outlined mr-1 ${
                                  success ? `text-success` : `text-danger`
                                }`}
                              >
                                {`${success ? `check_circle` : `cancel`}`}
                              </i>
                              {success ? (
                                <span className={`text-success`}>
                                  {constants.deleted}
                                </span>
                              ) : (
                                <span className={`text-danger`}>{msg}</span>
                              )}
                              <br />
                            </div>
                          ))}
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
                    selectedData.map((id) => {
                      let description;

                      if (type === 'contacts') {
                        const firstName =
                          data?.find((o) => o.id === id).first_name || '';
                        const lastName =
                          data?.find((o) => o.id === id).last_name || '';
                        const name = `${firstName} ${lastName}`;
                        const title =
                          data?.find((o) => o.id === id).title || null;
                        description = `${name}${title ? ` - ${title}` : ''} `;
                      } else if (type === 'organizations') {
                        description = data?.find((o) => o.id === id).name || '';
                      } else if (type === 'groups') {
                        description = data?.find((o) => o.id === id).name || '';
                      }

                      return <li key={`to-delete-${id}`}>{description}</li>;
                    })}
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
                        <Spinner className="spinner-grow-xs" />
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

export default DeleteModal;
