import { useState } from 'react';

const Stats = ({ data }) => {
  const [deals] = useState(12);
  const [accounts] = useState(34);
  const [inds] = useState(5);

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-header-title">My Stats</h4>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-6 col-lg">
            <div className="media align-items-center">
              <i className="material-icons-outlined font-size-3xl text-primary mr-3">
                monetization_on
              </i>
              <div className="media-body">
                <h5 className="d-block font-size-sm">Total Deals</h5>
                <div className="d-flex align-items-center">
                  <h3 className="mb-0">{deals}</h3>
                  <span className="badge badge-soft-success ml-2">
                    <i className="material-icons-outlined">trending_up</i> 12.5%
                  </span>
                </div>
              </div>
            </div>
            <div className="d-lg-none">
              <hr />
            </div>
          </div>
          <div className="col-sm-6 col-lg column-divider-lg">
            <div className="media align-items-center">
              <i className="material-icons-outlined font-size-3xl text-primary mr-3">
                people
              </i>
              <div className="media-body">
                <h5 className="d-block font-size-sm">Total Accounts</h5>
                <div className="d-flex align-items-center">
                  <h3 className="mb-0">{accounts}</h3>
                </div>
              </div>
            </div>
            <div className="d-lg-none">
              <hr />
            </div>
          </div>
          <div className="col-sm-6 col-lg column-divider-lg">
            <div className="media align-items-center">
              <i className="material-icons-outlined font-size-3xl text-primary mr-3">
                business
              </i>
              <div className="media-body">
                <h5 className="d-block font-size-sm">Industries</h5>
                <div className="d-flex align-items-center">
                  <h3 className="mb-0">{inds}</h3>
                </div>
              </div>
            </div>
            <div className="d-sm-none">
              <hr />
            </div>
          </div>
          <div className="col-sm-6 col-lg column-divider-lg">
            <div className="media align-items-center">
              <i className="material-icons-outlined font-size-3xl text-primary mr-3">
                assessment
              </i>
              <div className="media-body">
                <h5 className="d-block font-size-sm">Expected Revenue</h5>
                <div className="d-flex align-items-center">
                  <h3 className="mb-0">$232.65M</h3>
                  <span className="badge badge-soft-success ml-2">
                    <i className="material-icons-outlined">trending_up</i> 6.75%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
