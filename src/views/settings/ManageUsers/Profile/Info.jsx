import React from 'react';
import { Badge, Col, Row } from 'react-bootstrap';

import Avatar from '../../../../components/Avatar';

const Info = ({ profileInfo }) => {
  return (
    <Row>
      <Col md="auto">
        <Avatar user={profileInfo} defaultSize="xl" />
      </Col>
      <Col md="9">
        <h1 className="mb-0">
          {profileInfo?.first_name} {profileInfo?.last_name}
        </h1>
        <h4 className="fw-normal mb-2">{profileInfo?.email}</h4>
        <Badge
          variant="success"
          className="rounded-pill px-3 py-2 text-uppercase text-black"
        >
          {profileInfo?.status}
        </Badge>
      </Col>
    </Row>
  );
};

export default Info;
