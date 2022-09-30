import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Row } from 'react-bootstrap';
import Heading from '../../components/heading';
import { NO_REPORT_SELECTED } from '../../utils/constants';
import Alert from '../../components/Alert/Alert';
import AlertWrapper from '../../components/Alert/AlertWrapper';
import { processableExamples, SwitchAllReports } from './SwitchAllReports';
import { cubeService } from '../../services';
import NoDataFound from '../../components/commons/NoDataFound';

const InsightReports = () => {
  const [availableReports, setAvailableReports] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [insightReport, setInsightReport] = useState({});

  useEffect(async () => {
    const analytics = await cubeService.getAnalytics({ isPublic: true });

    const typeMap = {
      Course: 'TRAINING REPORTS',
      CourseProgress: 'TRAINING REPORTS',
      Deal: 'DEALS REPORTS',
      Lesson: 'TRAINING REPORTS',
      LessonProgress: 'TRAINING REPORTS',
    };
    const reports = analytics.reduce(
      (acc, analytic, idx) => {
        if (!processableExamples[analytic.name]) {
          return acc;
        }
        const type = typeMap[analytic.type];
        acc[type].push({
          ...analytic,
          id: idx,
          insightName: processableExamples[analytic.name],
        });

        return acc;
      },
      {
        'DEALS REPORTS': [],
        'TRAINING REPORTS': [],
      }
    );

    setAvailableReports(reports || {});
  }, []);

  const Title = () => {
    return <div className="text-muted">{NO_REPORT_SELECTED}</div>;
  };

  return (
    <div>
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <Heading title={'Reports'} useBc={true} showGreeting />

      <Row className="mt-3">
        <Col xl={3} md={3} className="mb-3">
          <Card className="bg-transparent border-0 shadow-none">
            {Object.entries(availableReports).map(([type, reports], idx) => (
              <Accordion defaultActiveKey={idx + 1} key={idx + 1}>
                <Card>
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey={idx + 1}
                    className="nav-subtitle cursor-pointer nav-link-toggle"
                  >
                    {type}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={idx + 1}>
                    <Card.Body className="p-1">
                      {reports.map((report) => (
                        <Row
                          key={report.id}
                          onClick={() => {
                            setInsightReport(report);
                          }}
                          className={`cursor-pointer align-items-center hoverLink p-2 px-3 ${
                            report.insightName === insightReport.insightName &&
                            'text-primary'
                          }`}
                        >
                          <Col xs={1}>
                            <span className="material-icons-outlined fs-20">
                              {report.icon}
                            </span>
                          </Col>
                          <Col xs="auto">
                            <p className="font-weight-medium font-size-sm2 mb-0">
                              {report.insightName}
                            </p>
                          </Col>
                        </Row>
                      ))}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            ))}
          </Card>
        </Col>
        <Col xl={9} md={12} className="pl-0">
          {SwitchAllReports({
            insight: { ...insightReport },
            insightName: insightReport.insightName,
          }) || (
            <NoDataFound
              title={<Title />}
              icon="analytics"
              containerStyle="w-100 height-300 text-muted"
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default InsightReports;
