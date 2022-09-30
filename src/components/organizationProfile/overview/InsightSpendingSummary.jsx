/** Component to render ROMG data in progress format, it takes ROMG summary
 * data and draw percentage  progress against Spending  percentage of card, ACH, Checks and Wire Transfer */
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { Chart as ChartJS, ArcElement, Legend } from 'chart.js';
import IdfDropdown from '../../idfComponents/idfDropdown';
import { isToFixedNoRound } from '../../../utils/Utils';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Legend);

const IndustryInsight = ({ naicsRpmgSummary }) => {
  const [transactionRange, setTransactionRange] = useState(undefined);
  const [transactionInfo, setTransactionInfo] = useState(undefined);

  const updateTransactionInfo = (transactionSummary) => {
    setTransactionInfo([
      transactionSummary.all_card_platforms,
      transactionSummary.checks,
      transactionSummary.ach,
      transactionSummary.wire_transfer,
    ]);
  };

  useEffect(() => {
    const transactionSummary = naicsRpmgSummary?.transaction_summary;
    if (transactionSummary?.length > 0) {
      const foundItem = transactionSummary.find(
        (item) => item.transaction.range === '2501-10000'
      );

      updateTransactionInfo(foundItem);
      setTransactionRange(foundItem.transaction.range);
    }
  }, [naicsRpmgSummary]);

  useEffect(() => {
    if (transactionRange) {
      const transactionSummary = naicsRpmgSummary?.transaction_summary;
      const index = transactionSummary.findIndex(
        (item) => item.transaction.range === transactionRange
      );
      updateTransactionInfo(transactionSummary[index]);
    }
  }, [transactionRange]);

  const circleConfig = {
    type: 'pie',
    data: {
      labels: ['Cards', 'Checks', 'ACH', 'Wires'],
      datasets: [
        {
          data: [
            transactionInfo ? transactionInfo[0] : 0,
            transactionInfo ? transactionInfo[1] : 0,
            transactionInfo ? transactionInfo[2] : 0,
            transactionInfo ? transactionInfo[3] : 0,
          ],
          borderWidth: 1,
          backgroundColor: ['#ff5a2c', '#f2c94c', '#27ae60', '#092ace'],
          borderColor: ['#ff5a2c', '#f2c94c', '#27ae60', '#092ace'],
          hoverBorderColor: '#fff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: 60,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
          },
        },
      },
    },
  };

  return (
    <>
      {naicsRpmgSummary && (
        <div className="mt-3 px-4">
          {naicsRpmgSummary?.transaction_summary?.length <= 0 ? (
            <div>No transaction summary found </div>
          ) : (
            <>
              <div className="mt-3">
                <div className="d-flex justify-content-between">
                  <h5 className="mt-2">Range</h5>
                  <IdfDropdown
                    className="ml-2 mb-3"
                    variant={'white'}
                    items={[
                      { label: 'Up to $2,500', value: '<2500' },
                      { label: '$2,500 to $10,000', value: '2501-10000' },
                      { label: '$10,000 to $100,000', value: '10001-100000' },
                      { label: 'Over $100,000', value: '>100001' },
                    ]}
                    onChange={(item) => setTransactionRange(item.value)}
                    defaultValue={transactionRange}
                  />
                </div>
                {transactionInfo && (
                  <Row>
                    <Col xl="12" md="12">
                      <div style={{ height: 200 }}>
                        <Doughnut
                          options={circleConfig.options}
                          data={circleConfig.data}
                        />
                      </div>
                    </Col>
                  </Row>
                )}

                <Row className="mt-3">
                  {/* Per $1MM of Revenue */}
                  <Col xl="8" md="8" className="text-left">
                    <span className="material-icons-outlined mr-1">
                      monetization_on
                    </span>
                    Per $1MM of Revenue
                  </Col>
                  <Col xl="4" md="4" className="text-right">
                    <span>
                      {isToFixedNoRound(
                        naicsRpmgSummary?.summary
                          ?.average_spending_per_mm_revenue,
                        0
                      )}
                    </span>
                  </Col>

                  {/* Per Transaction */}
                  <Col xl="8" md="8" className="text-left">
                    <span className="material-icons-outlined mr-1">
                      credit_card
                    </span>
                    Per Transaction
                  </Col>
                  <Col xl="4" md="4" className="text-right">
                    <span>
                      {isToFixedNoRound(
                        naicsRpmgSummary?.summary
                          ?.average_spending_per_transaction,
                        0
                      )}
                    </span>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default IndustryInsight;
