import { Spinner } from 'react-bootstrap';

const FullScreenSpinner = () => {
  return (
    <div className="fullscreen-spinner text-center">
      <Spinner animation="border" variant="primary" />
      <br />
      <span>Loading...</span>
    </div>
  );
};

export default FullScreenSpinner;
