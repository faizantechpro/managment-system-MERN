import Steps from '../../components/steps/Steps';

const ActivityStream = ({ me }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-header-title">Activity Stream</h4>{' '}
      </div>
      <div className="card-body">
        <Steps fetchAll={true} me={me} />
      </div>
    </div>
  );
};

export default ActivityStream;
