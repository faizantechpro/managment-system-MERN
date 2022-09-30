import { Col } from 'react-bootstrap';

import { CardButton } from '../../layouts/CardLayout';
import dataReportConstants from '../../../utils/constants/dataReport.json';

const constants = dataReportConstants.strings;

const GenerateReport = ({ setShowReportModal }) => {
  return (
    <>
      <Col xs={12} className={`text-center`}>
        <CardButton
          icon="addchart"
          className="m-6 font-weight-500"
          title={constants.reportButton.title}
          variant={constants.colors.success}
          onClick={() => setShowReportModal(true)}
        />
      </Col>
    </>
  );
};

export default GenerateReport;
