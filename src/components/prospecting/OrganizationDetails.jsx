import React from 'react';
import { Row, Col } from 'react-bootstrap';

const OrganizationDetails = ({ company }) => {
  return (
    <Row noGutters xs={12} className="w-100">
      <Col xs={6} md className="px-0">
        <div className="d-flex align-items-start w-100">
          <span className="material-icons-outlined mr-2 text-muted">place</span>
          <div>
            <p className="my-0">{company?.county}</p>
            <p className="my-0">{company?.address}</p>
            <p className="my-0">
              {company?.city}, {company?.state}
            </p>
            <p className="my-0">{company?.zip}</p>
            <p className="my-0">{company?.country}</p>
          </div>
        </div>
        <div className="d-flex align-items-start w-100 mt-3">
          <span className="material-icons-outlined mr-2 text-muted">
            public
          </span>
          <div>
            <a
              href={`https://www.${company?.domain}`}
              target="_blank"
              rel="noreferrer"
              className="my-0 cursor-pointer text-primary"
            >
              www.{company?.domain}
            </a>
          </div>
        </div>
      </Col>
      <Col xs={6} md className="px-0">
        <div className="mb-2">
          <span className="fw-bold">SIC Code: </span>
          {company?.sic_code}
        </div>
        <div className="mb-2">
          <span className="fw-bold">NAICS Code: </span>
          {company?.naics_code}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Revenue: </span>
          {company?.revenue}
        </div>
        <div className="mb-2">
          <span className="fw-bold">Employees: </span>
          {company?.employees}
        </div>
      </Col>
    </Row>
  );
};

export default OrganizationDetails;
