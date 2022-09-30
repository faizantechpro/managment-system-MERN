import { Col } from 'reactstrap';

const EmptyDataButton = ({
  setOpenModal,
  message,
  buttonLabel = '',
  buttonIcon = 'add',
}) => {
  return (
    <Col className="d-flex justify-content-center flex-column align-items-center  my-4">
      <p>{message}</p>
      {Boolean(buttonLabel) && (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          <span className="material-icons-outlined mr-1">{buttonIcon}</span>
          {buttonLabel}
        </button>
      )}
    </Col>
  );
};

export default EmptyDataButton;
