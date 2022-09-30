import {
  COMPLETED_LESSONS,
  POINTS_EARNED,
  PENDING_LESSONS,
} from '../../utils/constants';

const Overview = () => {
  return (
    <div className="card h-100">
      <div className="card-header">
        <h4 className="card-header-title">Resources</h4>{' '}
      </div>
      <div className="card-body">
        {/* <p className="card-text text-muted">
          16 lessons currently available are relevant to 74 of your active
          accounts. Complete lessons, earn points, get rewarded.
        </p> */}
        <div className="list-group list-group-lg list-group-flush list-group-no-gutters">
          <h5 className="list-group-item pb-3">Stats</h5>
          <div className="list-group-item pb-4">
            <div className="media align-items-center">
              {' '}
              <i className="material-icons-outlined font-size-2xl text-primary mr-3">
                loyalty
              </i>
              <div className="media-body d-flex flex-row align-items-center">
                <h4 className="mb-0">{POINTS_EARNED}</h4>
                <div className="d-flex align-items-center ml-auto">
                  {' '}
                  <span className="badge badge-soft-success mr-2">
                    {' '}
                    <i className="material-icons-outlined">
                      trending_up
                    </i> 25%{' '}
                  </span>
                  <h3 className="mb-0">45</h3>{' '}
                </div>
              </div>
            </div>
          </div>
          <div className="list-group-item py-4">
            <div className="media align-items-center">
              {' '}
              <i className="material-icons-outlined font-size-2xl text-primary mr-3">
                fact_check
              </i>
              <div className="media-body d-flex flex-row align-items-center">
                <h4 className="mb-0">{COMPLETED_LESSONS}</h4>
                <div className="d-flex align-items-center ml-auto">
                  <h3 className="mb-0">9</h3>{' '}
                </div>
              </div>
            </div>
          </div>
          <div className="list-group-item py-4">
            <div className="media align-items-center">
              {' '}
              <i className="material-icons-outlined font-size-2xl text-primary mr-3">
                pending
              </i>
              <div className="media-body d-flex flex-row align-items-center">
                <h4 className="mb-0">{PENDING_LESSONS}</h4>
                <div className="d-flex align-items-center ml-auto">
                  <h3 className="mb-0">3</h3>{' '}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
