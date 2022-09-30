import { Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { startCase } from 'lodash';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart } from 'chart.js';
const drawTextInside = {
  id: 'dText',
  beforeDraw: (chart) => {
    const { options } = chart;
    if (options.text) {
      const { width } = chart;
      const { height } = chart;
      const { ctx } = chart;
      ctx.restore();
      ctx.font = 'bold 28px Inter';
      ctx.textBaseline = 'middle';
      const { text } = options;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
      ctx.fillStyle = chart.data.datasets[0].backgroundColor[0];
      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  },
};

Chart.register([drawTextInside]);

// will move it to separate component file once the static page is ready
const TransactionItem = ({ item }) => {
  return (
    <Row className="row align-items-center no-gutters">
      <Col>
        <h5 className="font-size-sm text-muted">{item.text}</h5>
        <div className="d-flex align-items-center">
          <h3 className="mb-0">{item.value}</h3>
        </div>
      </Col>
      <Col
        className={
          item.percentage > 0
            ? 'col-auto font-weight-semi-bold text-danger'
            : 'col-auto font-weight-semi-bold text-muted'
        }
      >
        <span className="material-icons-outlined mr-1">{item.icon}</span>
        {item.percentage}
      </Col>
    </Row>
  );
};

const topDeclineCodes = (topDeclinedCodes) => {
  return topDeclinedCodes.map((declineCode) => (
    <li key={topDeclinedCodes.reason}>
      <span className="text-danger mr-3">
        {declineCode.percent?.toFixed(2)}%
      </span>
      {declineCode.reason}
    </li>
  ));
};

const getInterchangeChargesList = (interchangeCharges) => {
  return interchangeCharges.map((networkCharge) => (
    <Col className="mb-3" key={networkCharge.cardNetwork}>
      <Card>
        <Card.Body className="text-center font-weight-medium font-size-md">
          <h4 className="font-siz-xl mb-3">{networkCharge.cardNetwork}</h4>
          <p className="mb-2">${networkCharge.IcFee} IC Fees</p>
          <p className="mb-2">{networkCharge.IcRate}% Avg IC Rate</p>
        </Card.Body>
      </Card>
    </Col>
  ));
};

const getTransactionData = (merchantReportData) => {
  const TRANSACTION_DATA = [
    {
      id: 1,
      text: 'Total Transactions',
      value: merchantReportData.totalTransactions,
      icon: 'non',
      percentage: '- / MoM',
    },
    {
      id: 2,
      text: 'Total Dollars Processed',
      value: '$' + merchantReportData.totalDollarsProcessed,
      icon: 'non',
      percentage: '- / MoM',
    },
    {
      id: 3,
      text: 'Total Fees',
      value: '$' + Math.abs(merchantReportData.totalFees),
      icon: 'non',
      percentage: ' - / MoM',
    },
    {
      id: 4,
      text: 'Average Transactions',
      value: merchantReportData.averageTransactions,
      icon: 'non',
      percentage: '- / MoM',
    },
    {
      id: 5,
      text: 'Average Fee',
      value: Math.abs(merchantReportData.averageFees),
      icon: 'non',
      percentage: '- / MoM',
    },
  ];

  return TRANSACTION_DATA;
};

const CircleChartWithText = ({ text, data, options }) => {
  const config = {
    type: 'pie',
    data: {
      labels: ['Interchange Fees', 'Network Fees', 'Acquirer Fees'],
      datasets: [
        {
          ...data,
          borderWidth: 1,
          hoverBorderColor: '#fff',
        },
      ],
    },
    options: {
      ...options,
      text: text,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: false,
        tooltip: false,
      },
    },
  };

  return (
    <Doughnut type="doughnut" options={config.options} data={config.data} />
  );
};

const PieChart = ({ data }) => {
  const config = {
    type: 'pie',
    data: {
      labels: ['Interchange Fees', 'Network Fees', 'Acquirer Fees'],
      datasets: [
        {
          ...data,
          borderWidth: 1,
          hoverBorderColor: '#fff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: false,
      },
      tooltips: {
        postfix: '%',
        hasIndicator: true,
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
    },
  };
  return <Pie type="pie" options={config.options} data={config.data} />;
};

const MerchantReport = ({ merchantReportData }) => {
  return (
    <div className={`m-0 px-4`}>
      <h4 className={`font-weight-bolder py-4 px-0`}>
        {startCase(`By the Numbers`)}
      </h4>
      <Row>
        <Col md={6}>
          <ListGroup className="list-group-no-gutters list-group-flush">
            {getTransactionData(merchantReportData).map((item) => {
              return (
                <ListGroupItem className="py-4" key={item.id}>
                  <TransactionItem item={item} />
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </Col>
        <Col md={6} className="column-divider-md d-none">
          <h4>Saving Opportunity</h4>
          <Card className="border-danger border-width-2 mt-4">
            <Card.Body className="text-center py-6">
              <div style={{ height: '200px' }}>
                <CircleChartWithText
                  text={
                    merchantReportData?.savingOppertunity
                      ?.savingOppertunityPercent + '%'
                  }
                  data={{
                    data: [
                      merchantReportData?.savingOppertunity
                        ?.savingOppertunityPercent,
                      100 -
                        merchantReportData?.savingOppertunity
                          ?.savingOppertunityPercent,
                    ],
                    backgroundColor: ['#F44336', '#eee'],
                  }}
                  options={{ cutout: 80 }}
                />
              </div>
              <p className="font-size-ml font-weight-medium mt-5">
                Out of the ${merchantReportData?.totalDollarsProcessed} you
                processed, $
                {merchantReportData?.savingOppertunity?.higherRateProcessed} was
                processed inefficiently.
              </p>
              <p className="font-size-ml font-weight-medium mb-0">
                {' '}
                Annualized, you will pay an additional
                <span className="text-danger">
                  {' '}
                  ${
                    merchantReportData?.savingOppertunity?.additionalFeeToPay
                  }{' '}
                </span>{' '}
                in fees this year.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <hr className="my-4" />

      <h4 className={`font-weight-bolder px-0`}>
        {startCase(`Authorization to Approval Ratio`)}
      </h4>
      <Row>
        <Col md={6}>
          <div className="d-flex flex-column justify-content-center text-center">
            <span className="font-size-3xl font-weight-bolder text-success">
              {merchantReportData?.authorizationToApproval?.approvalPercent}%
            </span>
            <span className="font-weight-medium font-size-normal">
              {
                merchantReportData?.authorizationToApproval
                  ?.declinedTransactions
              }{' '}
              of {merchantReportData?.totalTransactions} transactions resulted
              in decline.
            </span>
          </div>

          <div className="d-flex flex-column justify-content-center text-center mt-3">
            <span className="font-size-3xl font-weight-bolder text-danger">
              ${' '}
              {Math.abs(
                merchantReportData?.authorizationToApproval
                  ?.lostRevnueFromDeclined
              )}
            </span>
            <span className="font-weight-medium font-size-ml">
              Total lost revenue from declines.
            </span>
          </div>
        </Col>
        <Col md={6} className="column-divider-md">
          <h4 className="text-danger">Top 3 Decline Codes</h4>
          <ul className="list-unstyled list-unstyled-py-4 font-size-md font-weight-semi-bold mt-4">
            {topDeclineCodes(
              merchantReportData?.authorizationToApproval?.topDeclinedCodes
            )}
          </ul>
        </Col>
      </Row>
      <div
        className="progress rounded-pill font-size-xs font-weight-semi-bold mt-5 mt-md-7"
        style={{ height: '1.25rem' }}
      >
        <div
          className="progress-bar-2 bg-danger"
          role="progressbar"
          style={{ width: '25%' }}
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        />
        <div
          className="progress-bar-2 bg-yellow"
          role="progressbar"
          style={{ width: '50%' }}
          aria-valuenow="50"
          aria-valuemin="0"
          aria-valuemax="100"
        />
        <div
          className="progress-bar-2 bg-success tooltip-show tl-hide"
          role="progressbar"
          style={{ width: '25%' }}
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
          data-toggle="tooltip"
          data-placement="top"
          data-html="true"
          title=""
          data-trigger="manual"
          data-bg="tooltip-blue"
          data-original-title="<strong>98.1%</strong>"
          aria-describedby="tooltip396278"
        />
      </div>
      <div className="d-flex flex-row align-items-center font-size-xs font-weight-medium mt-2">
        <div className="w-25" />
        <div className="w-50">80%</div>
        <div className="w-25">92%</div>
      </div>
      <hr className="my-4" />

      <Row className="align-items-top">
        <Col>
          <h4 className="font-weight-bolder">Refunds</h4>
          <div className="d-flex flex-column justify-content-center text-center px-md-4">
            <span className="font-size-3xl font-weight-bolder text-yellow">
              {merchantReportData?.refund?.refundPercent}%
            </span>
            <span className="font-weight-medium font-size-normal mt-3">
              {merchantReportData?.refund?.refundCount} of your{' '}
              {merchantReportData?.totalTransactions} transactions resulted in a
              refund, totaling ${merchantReportData?.refund?.refundAmount}.
            </span>
            <span className="font-weight-medium font-size-normal mt-3">
              Your refund percentage is considered
              <span className="text-yellow"> typical</span> vs. peers in MCC
              7399.
            </span>
          </div>
          <div
            className="progress rounded-pill font-size-xs font-weight-semi-bold mt-5 mt-md-7"
            style={{ height: '.75rem' }}
          >
            <div
              className="progress-bar-2 bg-danger"
              role="progressbar"
              style={{ width: '25%' }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            />
            <div
              className="progress-bar-2 bg-yellow tooltip-show  tl-hide"
              role="progressbar"
              style={{ width: '50%' }}
              aria-valuenow="50"
              aria-valuemin="0"
              aria-valuemax="100"
              data-toggle="tooltip"
              data-placement="top"
              data-html="true"
              title="<strong>0.37%</strong>"
              data-trigger="manual"
              data-bg="tooltip-blue"
            />
            <div
              className="progress-bar-2 bg-success"
              role="progressbar"
              style={{ width: '25%' }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <div className="d-none">
            <h4 className="text-danger mt-4">Top 3 Refund Codes</h4>
            <ul className="list-unstyled list-unstyled-py-2 font-size-md font-weight-semi-bold">
              {topDeclineCodes(merchantReportData?.refund?.topRefundCodes)}
            </ul>
          </div>
        </Col>
        <Col className="column-divider-md mt-3 mt-md-0">
          <h4 className="font-weight-bolder">Chargebacks</h4>
          <div className="d-flex flex-column justify-content-center text-center px-md-4">
            <span className="font-size-3xl font-weight-bolder text-danger">
              {merchantReportData?.chargeBacks?.chargeBackPercent}%
            </span>
            <span className="font-weight-medium font-size-normal mt-3">
              ${merchantReportData?.chargeBacks?.chargeBackCount} of your{' '}
              {merchantReportData?.totalTransactions} transactions resulted in a
              chargeback, totaling $
              {merchantReportData?.chargeBacks?.chargeBackAmount}.
            </span>
            <span className="font-weight-medium font-size-normal mt-3">
              Your chargeback percentage is considered
              <span className="text-danger"> high </span> vs. peers in MCC 7399.
            </span>
          </div>
          <div
            className="progress rounded-pill font-size-xs font-weight-semi-bold mt-5 mt-md-7"
            style={{ height: '.75rem' }}
          >
            <div
              className="progress-bar-2 bg-danger tooltip-show  tl-hide"
              role="progressbar"
              style={{ width: '25%' }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
              data-toggle="tooltip"
              data-placement="top"
              data-html="true"
              title="<strong>0.93%</strong>"
              data-trigger="manual"
              data-bg="tooltip-blue"
            />
            <div
              className="progress-bar-2 bg-yellow"
              role="progressbar"
              style={{ width: '50%' }}
              aria-valuenow="50"
              aria-valuemin="0"
              aria-valuemax="100"
            />
            <div
              className="progress-bar-2 bg-success"
              role="progressbar"
              style={{ width: '25%' }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <h4 className="text-danger mt-4">Top 3 Chargeback Codes</h4>
          <ul className="list-unstyled list-unstyled-py-2 font-size-md font-weight-semi-bold">
            {topDeclineCodes(
              merchantReportData?.chargeBacks?.topChargeBackCodes
            )}
          </ul>
        </Col>
      </Row>
      <hr className="my-4" />

      <h4 className="font-weight-bolder mb-1">
        How Merchant Fees Are Calculated
      </h4>
      <p className="font-size-sm text-muted">
        There are three main categories that make up your merchant processing
        fees.
      </p>
      <Card className="mt-4 d-none">
        <Card.Body>
          <Row className="align-items-center text-center text-md-left">
            <Col>
              <img
                className="avatar avatar-xxl"
                src="https://custom.identifee.com/assets/svg/illustrations/credit-card.svg"
                alt="Image Description"
              />
            </Col>
            <Col className="mt-3 md-md-0 ">
              <div className="font-weight-semi-bold font-size-ml">
                {merchantReportData?.merchantFees?.percentNotConrolled}% of all
                your merchant processing fees are not controlled by Excel Bank.
              </div>
            </Col>
            <Col>
              <div className="mt-3 mt-md-0">
                <div style={{ height: '128px' }}>
                  <PieChart
                    data={{
                      percent:
                        merchantReportData?.merchantFees?.percentNotConrolled,
                      data: [
                        merchantReportData?.merchantFees?.percentNotConrolled,
                        100 -
                          merchantReportData?.merchantFees?.percentNotConrolled,
                      ],
                      backgroundColor: ['#F44336', '#71869d'],
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <ListGroup className="list-group-no-gutters list-group-flush">
        <ListGroupItem className="py-5">
          <Row>
            <Col md={3}>
              <CircleChartWithText
                text={
                  merchantReportData?.merchantFees?.interchangeFee?.percent +
                  '%'
                }
                data={{
                  data: [
                    merchantReportData?.merchantFees?.interchangeFee?.percent,
                    100 -
                      merchantReportData?.merchantFees?.interchangeFee?.percent,
                  ],
                  backgroundColor: ['#F44336', '#eee'],
                }}
                options={{ cutout: 60 }}
              />
            </Col>
            <Col>
              <div className="col-md mt-3 mt-md-0 font-size-md font-weight-medium">
                <p className="mb-2">
                  Approximately{' '}
                  {merchantReportData?.merchantFees?.interchangeFee?.percent}%
                  of your fees are interchange fees.
                </p>
                <p className="mb-2">
                  Regular Debit:
                  {
                    merchantReportData?.merchantFees?.interchangeFee
                      ?.regularDebitPercent
                  }
                  % & $
                  {
                    merchantReportData?.merchantFees?.interchangeFee
                      ?.regularDebitPerTransactiont
                  }{' '}
                  Per Transaction
                </p>
                <p className="mb-2">
                  Corporate Debit:{' '}
                  {
                    merchantReportData?.merchantFees?.interchangeFee
                      ?.corporateCreditPercent
                  }
                  % & $
                  {
                    merchantReportData?.merchantFees?.interchangeFee
                      ?.corporateCreditPerTransaction
                  }{' '}
                  Per Transaction
                </p>
                <p className="mb-0">Card Issuer (Interchange)</p>
              </div>
            </Col>
          </Row>
        </ListGroupItem>
        <ListGroupItem className="py-5">
          <Row>
            <Col md={3}>
              <CircleChartWithText
                text={
                  merchantReportData?.merchantFees?.networkFees
                    ?.networkFeePercent + '%'
                }
                data={{
                  data: [
                    merchantReportData?.merchantFees?.networkFees
                      ?.networkFeePercent,
                    100 -
                      merchantReportData?.merchantFees?.networkFees
                        ?.networkFeePercent,
                  ],
                  backgroundColor: ['#97a4af', '#eee'],
                }}
                options={{ cutout: 60 }}
              />
            </Col>
            <Col>
              <div className="col-md mt-3 mt-md-0 font-size-md font-weight-medium">
                <p className="mb-2">
                  Approximately{' '}
                  {
                    merchantReportData?.merchantFees?.networkFees
                      ?.networkFeePercent
                  }
                  % of your fees are network related.
                </p>
                <p className="mb-2">
                  Assessment Fee:{' '}
                  {merchantReportData?.merchantFees?.networkFees?.assessmentFee}
                  % Per Transaction
                </p>
                <p className="mb-2">
                  Access Fee:{' '}
                  {merchantReportData?.merchantFees?.networkFees?.accessFee}%
                  Per Transaction
                </p>
                <p className="mb-0">
                  {merchantReportData?.merchantFees?.networkFees?.networks}
                </p>
              </div>
            </Col>
          </Row>
        </ListGroupItem>
        <ListGroupItem className="pt-5 pb-0">
          <Row>
            <Col md={3}>
              <CircleChartWithText
                text={
                  merchantReportData?.merchantFees?.acquirerFees?.percent + '%'
                }
                data={{
                  data: [
                    merchantReportData?.merchantFees?.acquirerFees?.percent,
                    100 -
                      merchantReportData?.merchantFees?.acquirerFees?.percent,
                  ],
                  backgroundColor: ['#97a4af', '#eee'],
                }}
                options={{ cutout: 60 }}
              />
            </Col>
            <Col>
              <div className="col-md mt-3 mt-md-0 font-size-md font-weight-medium">
                <p className="mb-2">
                  Approximately{' '}
                  {merchantReportData?.merchantFees?.acquirerFees?.percent}% of
                  your fees are acquirer related.
                </p>
                <p className="mb-0">
                  {merchantReportData?.merchantFees?.acquirerFees?.type}
                </p>
              </div>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
      <div className="d-none">
        <hr className="my-4" />

        <h4 className="font-weight-bolder">Survey Question</h4>
        <div className="media align-items-center mt-4">
          <span className="material-icons-outlined font-size-6xl text-green mr-4">
            ballot
          </span>
          <div className="media-body d-flex flex-column">
            <p className="font-size-ml font-weight-medium">
              How soon do you want to take action to realize the estimated
              savings on the report? Please select one of the following:
            </p>
            <div className="d-flex flex-row align-items-center">
              <button href="javasript:;" className="btn btn-success">
                Immediately
              </button>
              <button href="javasript:;" className="btn btn-warning ml-3">
                Within 90 Days
              </button>
              <button href="javasript:;" className="btn btn-secondary ml-3">
                Not A Priority
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div className="d-none">
        <h4 className="font-weight-bolder">Three Ways You Can Save</h4>
        <Row>
          <Col>
            <div style={{ height: '12rem', marginTop: '20px' }}>
              <CircleChartWithText
                data={{
                  labels: ['Level 2', 'Downgrades', 'Level 3'],
                  data: [24063.3, 3029.04, 20014.93],
                  backgroundColor: ['#27ae60', '#00c9db', '#00c9a7'],
                }}
                options={{ cutout: 75 }}
              />
            </div>
          </Col>
          <Col>
            <div className="mt-3 mt-md-0 text-center">
              <p className="font-size-3xl font-weight-bolder text-success">
                $47,107.27
              </p>
              <p className="font-weight-bold font-size-normal text-success">
                Potential Monthly Savings
              </p>
              <p className="font-weight-medium font-size-normal">
                Talk with your Merchant Account Manager for further details.
              </p>
              <button className="btn btn-success">
                <span className="material-icons-outlined mr-1">
                  question_answer
                </span>
                Contact Us
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <Row className="mt-4 mt-md-6 text-center d-none">
        <Col>
          <p className="font-size-xl font-weight-bolder text-cyan mb-2">
            $3,029.04
          </p>
          <div className="d-flex flex-row align-items-center justify-content-center">
            <h4 className="text-cyan mb-0">Downgrades</h4>
            <span className="avatar avatar-sm bg-cyan text-white avatar-circle ml-3">
              <em className="avatar-initials">
                <em className="material-icons-outlined">arrow_downward</em>
              </em>
            </span>
          </div>
          <p className="font-size-md font-weight-medium mt-3">
            84 transactions could have potentially been downgraded because you
            did not provide a zip code or authorize and settle within 24 hours.
          </p>

          <div className="d-md-none">
            <hr />
          </div>
        </Col>
        <Col className="column-divider-md mt-3 mt-md-0">
          <p className="font-size-xl font-weight-bolder text-success mb-2">
            $24,063.30
          </p>
          <div className="d-flex flex-row align-items-center justify-content-center">
            <h4 className="text-success mb-0">Level 2</h4>
            <span className="avatar avatar-sm bg-success text-white avatar-circle ml-3">
              <span className="avatar-initials">2</span>
            </span>
          </div>
          <p className="font-size-md font-weight-medium mt-3">
            1,925 transactions could have been potentially could have been
            processed at lower rates (known as level 2).
          </p>

          <div className="d-md-none">
            <hr />
          </div>
        </Col>
        <Col className="column-divider-md mt-3 mt-md-0">
          <p className="font-size-xl font-weight-bolder text-teal mb-2">
            $20,014.93
          </p>
          <div className="d-flex flex-row align-items-center justify-content-center">
            <h4 className="text-teal mb-0">Level 3</h4>
            <span className="avatar avatar-sm bg-teal text-white avatar-circle ml-3">
              <span className="avatar-initials">3</span>
            </span>
          </div>
          <p className="font-size-md font-weight-medium mt-3">
            980 transactions could have been potentially could have been
            processed at lower rates (known as level 3).
          </p>
        </Col>
      </Row>
      <hr className="my-4" />

      <h4 className="font-weight-bolder">Interchange Fee Summary</h4>
      <Row className="mt-4">
        {getInterchangeChargesList(
          merchantReportData?.merchantFees?.networkFees?.networkInterchangeFee
        )}
      </Row>
    </div>
  );
};

export default MerchantReport;
