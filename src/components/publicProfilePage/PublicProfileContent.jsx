import { Col } from 'react-bootstrap';
import PublicAddContent from './PublicAddContent';

import PublicProfileHeader from './PublicProfileHeader';

const PublicProfileContent = (props) => {
  const { reportData } = props || {};

  return (
    <Col>
      <div className="p-5">
        <div className="page-header mb-3">
          <PublicProfileHeader {...props} />

          <PublicAddContent
            dataSection
            organizationId={reportData?.organization_id}
            {...props}
          />
        </div>
      </div>
    </Col>
  );
};

export default PublicProfileContent;
