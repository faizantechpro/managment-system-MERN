import { Row, Col, Tabs, Tab } from 'react-bootstrap';

const ShareToolbar = ({ id, activeTab, setActiveTab, classNameTabs, tabs }) => {
  return (
    <Row className={`justify-content-center`}>
      <Col className={`col-auto`}>
        <Tabs
          id={id}
          activeKey={activeTab || ''}
          onSelect={(k) => setActiveTab(k) || {}}
          className={`modal-report-tabs p-1 ${classNameTabs || ''}`}
          variant={``}
        >
          {tabs?.map((tab) => {
            return (
              <Tab
                key={`${id || 'tab'}_${tab.name}`}
                eventKey={tab.name}
                title={tab.label}
                disabled={tab.disabled || false}
              ></Tab>
            );
          })}
        </Tabs>
      </Col>
    </Row>
  );
};

export default ShareToolbar;
