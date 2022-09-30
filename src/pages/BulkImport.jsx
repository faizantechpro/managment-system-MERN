import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Heading from '../components/heading';
import routes from '../utils/routes.json';
import SettingCardItem from '../components/commons/SettingCardItem';

const BulkImport = () => {
  return (
    <div>
      <Heading title="Select Import type" />
      <Row>
        <Col md={3}>
          <SettingCardItem
            item={{ title: 'Import Organization', icon: 'corporate_fare' }}
            url={routes.importOrg}
          />
        </Col>
        <Col md={3}>
          <SettingCardItem
            item={{ title: 'Import People', icon: 'people_outline' }}
            url={routes.importPeople}
          />
        </Col>
      </Row>
    </div>
  );
};

export default BulkImport;
