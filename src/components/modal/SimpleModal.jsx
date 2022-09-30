import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';

const SimpleModal = ({
  children,
  modalTitle,
  open,
  handleSubmit,
  buttonsDisabled,
  onHandleCloseModal,
  isLoading,
  customModal,
  buttonLabel,
  allowCloseOutside = true,
  close,
  ...rest
}) => {
  return (
    <Modal
      fade={false}
      isOpen={open}
      {...rest}
      className={customModal}
      toggle={allowCloseOutside ? onHandleCloseModal : null}
    >
      <ModalHeader close={close} tag="h2" toggle={onHandleCloseModal}>
        {modalTitle}
      </ModalHeader>
      <ModalBody>{children}</ModalBody>

      <ModalFooter>
        <>
          <button
            className="btn btn-white"
            onClick={onHandleCloseModal}
            disabled={isLoading}
          >
            Cancel
          </button>
          {handleSubmit && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isLoading || buttonsDisabled}
            >
              {isLoading ? <Spinner /> : <span>{buttonLabel}</span>}
            </button>
          )}
        </>
      </ModalFooter>
    </Modal>
  );
};

export default SimpleModal;
