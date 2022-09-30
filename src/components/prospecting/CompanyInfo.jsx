import React from 'react';
import { Col, Image, Row } from 'react-bootstrap';

import linkedin from '../../assets/svg/linkedin.svg';

const CompanyInfo = ({ company = {} }) => {
  const ImageUrl = company.logo?.replace('logos', 'logo');

  return (
    <Row className="w-100">
      <Col xs={12} lg={6} className="d-flex flex-start mb-3">
        <Image src={ImageUrl} className="avatar-xl mr-3" />
        <div className="d-flex flex-row align-items-start flex-base">
          <div className="mr-auto">
            <h3 className="text-capitalize">{company?.company_name}</h3>
            <div className="text-muted">
              <p>
                <span className="material-icons-outlined mr-2">public</span>
                <a
                  href={`https://www.${company?.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="my-0 cursor-pointer text-primary"
                >
                  www.{company?.domain}
                </a>
              </p>
              <p>
                <span className="material-icons-outlined mr-2">call</span>
                <span className="text-primary">{company?.phone_number}</span>
              </p>
              <p>
                <span className="material-icons-outlined mr-2">print</span>
                <span className="text-primary">{company?.fax_number}</span>
              </p>
            </div>
          </div>
          <div>
            <Image src={linkedin} />
          </div>
        </div>
      </Col>
      <Col xs={12} lg={6} className="border-lg-left border-md-top pt-lg-3-lgw">
        <Row noGutters>
          <Col xs={6} md={6} className="px-0">
            <div className="d-flex align-items-start w-100">
              <span className="material-icons-outlined mr-2 text-muted">
                place
              </span>
              <div>
                <p className="my-0">{company.county}</p>
                <p className="my-0">{company.address}</p>
                <p className="my-0">
                  {company.city}, {company.state}
                </p>
                <p className="my-0">{company.zip}</p>
                <p className="my-0">{company.country}</p>
              </div>
            </div>
            <div className="d-flex align-items-start w-100 mt-3">
              <span className="material-icons-outlined mr-2 text-muted">
                alternate_email
              </span>
              <div>
                <p className="fw-bold mb-0">Most Common Email Pattern</p>
                <p className="my-0">{company?.email_patter}</p>
              </div>
            </div>
            <div className="d-flex align-items-start w-100 mt-3">
              <span className="material-icons-outlined mr-2 text-muted">
                analytics
              </span>
              <div>
                <p className="fw-bold mb-0">Alexa Ranking</p>
                <p className="my-0">{company?.alexa_rank}</p>
              </div>
            </div>
          </Col>
          <Col xs={6} md={6} className="px-0">
            <div className="mb-2">
              <span className="fw-bold">SIC Code: </span>
              {company?.sic_code}
            </div>
            <div className="mb-2">
              <span className="fw-bold">NAICS Code:</span>
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
            <div className="mb-2">
              <span className="fw-bold">Type: </span>
              {company?.type}
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default CompanyInfo;
