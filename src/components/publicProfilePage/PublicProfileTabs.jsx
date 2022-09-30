import { Col, Row, Tabs, Tab } from 'react-bootstrap';

const PublicProfileTabs = ({ reportData }) => {
  const toolbarItems = [{ name: 'treasury', label: 'Treasury' }];

  return (
    <Row className="d-flex align-items-center mb-3">
      <Col className="col-auto">
        <Tabs
          className={`modal-report-tabs p-1`}
          variant={``}
          activeKey={reportData?.type?.toLowerCase() || ''}
        >
          {toolbarItems?.map((tab) => {
            return (
              <Tab
                key={`${'tab'}_${tab.name}`}
                eventKey={tab.name}
                title={tab.label}
                disabled={tab.disabled || false}
              />
            );
          })}
        </Tabs>
      </Col>
    </Row>
  );
};

export default PublicProfileTabs;
