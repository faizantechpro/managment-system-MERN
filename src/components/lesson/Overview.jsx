import React from 'react';
import { Row, Col, Media, Card } from 'reactstrap';

import {
  COMPLETED_LESSONS,
  POINTS_EARNED,
  PENDING_LESSONS,
  TOTAL_LESSONS,
} from '../../utils/constants';

const Overview = ({ points, completed, pending, total_lessons }) => {
  return (
    <Card className="mb-5 py-3">
      <div className="card-body">
        <Row>
          <Col sm={3} lg className="column-divider-lg">
            <Media className="align-items-center">
              <i className="material-icons-outlined font-size-4xl text-primary mr-3">
                pending
              </i>
              <Media body>
                <h4 className="d-block">{TOTAL_LESSONS}</h4>
                <div className="d-flex align-items-center">
                  <h2 className="mb-0">{total_lessons}</h2>
                </div>
              </Media>
            </Media>
          </Col>
          <Col sm={3} lg>
            <Media className="align-items-center">
              <i className="material-icons-outlined font-size-4xl text-primary mr-3">
                loyalty
              </i>
              <Media body>
                <h4 className="d-block">{POINTS_EARNED}</h4>
                <div className="d-flex align-items-center">
                  <h2 className="mb-0">{points || 0}</h2>
                  {/* <span className="badge badge-soft-success ml-2">
                    <i className="material-icons-outlined">{trendDir}</i>
                    {trend}%
                  </span> */}
                </div>
              </Media>
            </Media>
            <div className="d-lg-none">
              <hr />
            </div>
          </Col>
          <Col sm={3} lg className="column-divider-lg">
            <Media className="align-items-center">
              <i className="material-icons-outlined font-size-4xl text-primary mr-3">
                fact_check
              </i>
              <Media body>
                <h4 className="d-block">{COMPLETED_LESSONS}</h4>
                <div className="d-flex align-items-center">
                  <h2 className="mb-0">{completed}</h2>
                </div>
              </Media>
            </Media>
            <div className="d-lg-none">
              <hr />
            </div>
          </Col>
          <Col sm={3} lg className="column-divider-lg">
            <Media className="align-items-center">
              <i className="material-icons-outlined font-size-4xl text-primary mr-3">
                pending
              </i>
              <Media body>
                <h4 className="d-block">{PENDING_LESSONS}</h4>
                <div className="d-flex align-items-center">
                  <h2 className="mb-0">{pending}</h2>
                </div>
              </Media>
            </Media>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default Overview;
