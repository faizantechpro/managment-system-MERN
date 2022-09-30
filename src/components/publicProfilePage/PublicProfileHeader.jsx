import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import organizationService from '../../services/organization.service';
import Avatar from '../Avatar';

const PublicProfileHeader = ({ reportData, organizationId }) => {
  const [organizationData, setOrganizationData] = useState(null);

  useEffect(() => {
    if (organizationId) {
      getOrganization();
    }
  }, [organizationId]);

  const getOrganization = async () => {
    const resp = await organizationService.getOrganizationById(organizationId);

    if (resp) {
      const newReportData = {
        ...reportData,
        organization: resp,
      };

      setOrganizationData(newReportData);
    }
  };

  return (
    <Row className="d-flex align-items-center mb-3 pb-4 border-bottom">
      <Col xs={12} md={10}>
        <div className="d-flex align-items-center">
          <Avatar
            user={organizationData?.organization}
            classModifiers="avatar-lg"
            type=""
          />

          <div className="col-lg col-12 mb-3 mb-lg-0">
            <h1 className="page-header-title">
              {organizationData?.organization?.name}
            </h1>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default PublicProfileHeader;
