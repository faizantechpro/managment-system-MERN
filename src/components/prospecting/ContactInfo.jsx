import React from 'react';
import { Image, Col, Row } from 'react-bootstrap';

import DefaultAvatar from '../DefaultAvatar';
import linkedin from '../../assets/svg/linkedin.svg';
import routes from '../../utils/routes.json';

const ContactInfo = ({ details }) => {
  const { first_name, last_name, job_function, company, email, linkedin_url } =
    details;

  return (
    <Row noGutters className="w-100">
      <Col xs={12} className="d-flex flex-start">
        <DefaultAvatar
          user={{ first_name, last_name }}
          classModifiers="avatar-xl mr-4"
        />
        <div className="d-flex flex-row align-items-start flex-base">
          <div className="mr-auto">
            <h3 className="text-capitalize">
              {first_name} {last_name}
            </h3>
            <p className="text-muted">{job_function}</p>
            <div className="text-muted">
              <p>
                <span className="material-icons-outlined mr-2">business</span>
                <a
                  className="text-primary cursor-pointer"
                  href={`${routes.prospects}/company/${company?.domain}`}
                >
                  {company?.company_name}
                </a>
              </p>
              <p>
                <span className="material-icons-outlined mr-2">email</span>
                <span className="text-primary">{email}</span>
              </p>
              <p>
                <span className="material-icons-outlined mr-2">call</span>
                <span className="text-primary">{company?.phone_number}</span>
              </p>
            </div>
          </div>
          <div>
            <a href={linkedin_url} target="_blank" rel="noreferrer">
              <Image src={linkedin} />
            </a>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ContactInfo;
