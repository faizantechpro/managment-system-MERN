/* Industry Insight component which take NAICS Code , Fetch RPMG Summary data and process it. */
import React, { useEffect, useState } from 'react';
import naicsService from '../../../services/naics.service';
import { Row, Col, Spinner } from 'reactstrap';
import rpmgIcon from '../../../assets/svg/brands/rpmg_logo.png';
import InsightSpendingSummary from './InsightSpendingSummary';
import RelatedLessons from '../../lesson/RelatedLessons';
import WorkingCapital from './WorkingCapital';

const IndustryInsight = ({ naicsCode }) => {
  const [naicsRpmgSummary, setNaicsRpmgSummary] = useState(undefined);
  const [naicsSpSummary, setNaicsSpSummary] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const getNaicsRpmgSpSummary = async () => {
    setIsLoading(true);

    const getRpmgSummary = async () => {
      try {
        const rpmgResult = await naicsService.getNaicsRpmgSummary(naicsCode);
        setNaicsRpmgSummary(rpmgResult);
      } catch (error) {
        setNaicsRpmgSummary(undefined);
      }
    };
    const getSPSummary = async () => {
      try {
        const spResult = await naicsService.getNaicsSpSummary(naicsCode);
        setNaicsSpSummary(spResult);
      } catch (error) {
        setNaicsSpSummary(undefined);
      }
    };

    await Promise.all([getRpmgSummary(), getSPSummary()]);

    setIsLoading(false);
  };

  useEffect(() => {
    getNaicsRpmgSpSummary();
  }, []);

  return (
    <>
      {isLoading === false ? (
        <div>
          <>
            {naicsRpmgSummary?.industry && (
              <div className="bg-gray-300">
                <p className="text-center py-2">
                  Vertical: <strong>{naicsRpmgSummary.industry}</strong>
                </p>
              </div>
            )}
            <div className="mt-3 px-4">
              <Row className="mt-3">
                <Col xs="8">
                  <h4 className="text-left">Spending Summary</h4>{' '}
                </Col>
                <Col xs="4" className="text-right">
                  <img
                    style={{ width: 80, height: 20, marginTop: -5 }}
                    src={rpmgIcon}
                    alt="RPMG"
                  />
                </Col>
              </Row>
            </div>
            {naicsRpmgSummary ? (
              <InsightSpendingSummary naicsRpmgSummary={naicsRpmgSummary} />
            ) : (
              <div className="p-4">
                <h5> No industry insight found against NAICS code</h5>
              </div>
            )}
            <hr />
            {/* Working Capital */}
            <WorkingCapital naicsSpSummary={naicsSpSummary} />
            <hr />
          </>

          {/* Related Lessons */}
          <div className="mt-3 px-4">
            <RelatedLessons />
          </div>
        </div>
      ) : (
        <div className="mt-4 center-item">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default IndustryInsight;
