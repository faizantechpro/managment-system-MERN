import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import moment from 'moment';
import DatePicker from '../../../components/dealsBreakdown/DatePicker';
import * as chrono from 'chrono-node';

const ReportToolbar = ({
  id,
  activeTab,
  setActiveTab,
  setSelectedDuration,
  classNameTabs,
  tabs,
  classNameRow,
}) => {
  const [dateRange, setDateRange] = useState({});
  const format = 'YYYYMMDD';

  useEffect(() => {
    const relativeDate = chrono.parseDate('from 30 day ago to now');
    setDateRange({
      startDate: moment(relativeDate).format(format),
      endDate: moment().format(format),
    });
  }, []);

  useEffect(() => {
    if (!dateRange) {
      return;
    }

    const startDate = moment(dateRange.startDate).format(format);
    const endDate = moment(dateRange.endDate).format(format);
    setSelectedDuration && setSelectedDuration(startDate, endDate);
  }, [dateRange]);

  return (
    <>
      <Row className={classNameRow}>
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
        {activeTab === 'merchant' && (
          <Col>
            <DatePicker
              range={dateRange}
              setRange={setDateRange}
              disablePastDate
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default ReportToolbar;
