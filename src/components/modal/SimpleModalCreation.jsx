import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';

export default function SimpleModalCreation({
  children,
  modalTitle,
  open,
  handleSubmit,
  buttonsDisabled,
  onHandleCloseModal,
  errorMessage,
  setErrorMessage,
  isLoading,
  editFields,
  saveButton,
  successMessage,
  setSuccessMessage,
  customModal,
  bodyClassName,
  bankTeam = false,
  toggle,
  noFooter = false,
  saveButtonStyle = 'btn-primary',
  ...rest
}) {
  return (
    <Modal isOpen={open} fade={false} {...rest} className={customModal}>
      <ModalHeader tag="h2" toggle={toggle}>
        {modalTitle}
      </ModalHeader>
      <ModalBody className={`${bodyClassName} mb-0 pb-0`}>{children}</ModalBody>

      {(bankTeam === false || noFooter === false) && (
        <ModalFooter>
          {onHandleCloseModal && (
            <button
              className="btn btn-white btn-sm"
              data-dismiss="modal"
              onClick={onHandleCloseModal}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          {handleSubmit && (
            <button
              type="button"
              className={`btn btn-sm ${saveButtonStyle}`}
              onClick={handleSubmit}
              disabled={isLoading || buttonsDisabled}
            >
              {isLoading ? (
                <Spinner className="spinner-grow-xs" />
              ) : (
                <span>{editFields ? 'Update' : saveButton || 'Save'}</span>
              )}
            </button>
          )}
        </ModalFooter>
      )}
    </Modal>
  );
}
