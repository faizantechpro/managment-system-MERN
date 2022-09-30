import { Spinner } from 'reactstrap';

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center height-container-spinner">
      <Spinner color="primary" />
    </div>
  );
}
