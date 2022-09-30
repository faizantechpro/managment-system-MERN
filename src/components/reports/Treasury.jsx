import { startCase } from 'lodash';
import React from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';

import { toUSD } from '../../utils/currency';

export const Component = (props) => {
  const renderDate = new Date(props.input.date);
  return (
    <>
      <div className="main">
        <div className="cover-img">
          <img
            src={`/templates/reports/types/${props.input.type}/img/cover.png`}
          />
          <div className="bank-logo-wide">
            <img src={'/templates/reports/banks/gwb/img/logo-wide.jpg'} />
          </div>
          <div className="main-title">Treasury Management Proposal</div>

          <div className="sub-title">{props.input.client_name}</div>
          <div className="date-title">
            {renderDate.toLocaleString('default', { month: 'long' })}{' '}
            {renderDate.getFullYear()}
          </div>
        </div>
      </div>
      <div className="main">
        <div className="banner-treasure">
          <img
            src={`/templates/reports/types/${props.input.type}/img/page-2-header.png`}
          />
          <div className="banner-text">
            <h2>Pricing Comparison</h2>
            <p>How do we compare vs. your current bank partner?</p>
          </div>
          <TreasuryCalculationWrapper {...props} />
          <img
            className="bank-bottom-logo"
            src={'/templates/reports/banks/gwb/img/stack_rgb.png'}
          />
        </div>
      </div>
    </>
  );
};

/**
 * Adds div wrapper with class to be used for report pdf
 */
export const TreasuryCalculationWrapper = (props) => {
  return (
    <div className={'bank-chart'}>
      <TreasuryCalculation {...props} />
    </div>
  );
};

/**
 * Component which uses calculated output to derive charts
 */
export const TreasuryCalculation = (props) => {
  const hasSavings = props.output.annual_estimated_savings > 0;
  const estimatedReturnStr = hasSavings ? 'savings' : 'losses';

  return (
    <>
      <Row
        className={`justify-content-md-center align-items-center border-bottom m-0 px-4 pb-4`}
      >
        <Col as={`h4`} sm={12} className={`font-weight-bolder py-4 px-0`}>
          {startCase(`Total estimated ${estimatedReturnStr}`)}
        </Col>
        <Col sm={12} md={5} className={`text-center`}>
          <span
            className={`${
              hasSavings ? `text-success` : `text-danger`
            } display-3 font-weight-bolder`}
          >
            {`${toUSD(props.output.annual_estimated_savings)}`}
          </span>
        </Col>
        <Col sm={12} md={7} className={`text-center p-0`}>
          <p className={`mb-0 font-size-lg font-weight-medium`}>
            {`Estimated annual ${estimatedReturnStr} by switching to ${props.input.proposed_bank_name}.`}
          </p>
        </Col>
        <Col sm={12} md={8} className={`text-center`}>
          <p className={`text-muted font-size-sm mb-0 font-weight-500`}>
            {`*Based on your statement provided to ${props.input.proposed_bank_name}.`}
            <br />
            {`This is an estimate. Actual fees are determined by average balance and product usage. See Pricing Proforma for additional details.`}
          </p>
        </Col>
      </Row>
      <Row className={`align-items-center m-0 px-2 pt-2`}>
        <Col as={`h4`} className={`font-weight-bolder pt-4`}>
          {`Proposed pricing`}
        </Col>
        <Col sm={6} md={`auto`} className="pt-3">
          <span className="legend-indicator bg-progress-success"></span>
          {`${props.input.proposed_bank_name} Bank`}
        </Col>
        <Col sm={6} md={`auto`} className="pt-3">
          <span className={`legend-indicator bg-medium`}></span>
          {`Current Bank`}
        </Col>
      </Row>
      {props.output.services.map((service, idx) => {
        return (
          <CompareProgressBarUSD key={idx} {...service}></CompareProgressBarUSD>
        );
      })}
    </>
  );
};

export const CompareProgressBarUSD = (props) => {
  return CompareProgressBar({
    name: props.name,
    proposedValue: props.proposed_item_fee,
    proposedValueStr: toUSD(props.proposed_item_fee),
    value: props.item_fee,
    valueStr: toUSD(props.item_fee),
  });
};

export const CompareProgressBar = (props) => {
  // TODO what if proposed value is higher?
  const savingsPercentage = (props.proposedValue / props.value) * 100;

  return (
    <>
      <Row className="m-0 px-2 py-2">
        <Col className="col-auto col-md-2 text-success order-xs-1 order-md-0 font-weight-500">
          {props.proposedValueStr}
        </Col>
        <Col className="col order-xs-2 order-md-1 pt-2">
          <ProgressBar variant={`progress-success`} now={savingsPercentage} />
        </Col>
        <Col className="col-12 col-md-3 text-md-center order-xs-0 order-md-2 mb-2 mb-md-0 font-weight-500">
          {props.name}
        </Col>
        <Col className="col order-xs-4 order-md-3 pt-2">
          <ProgressBar variant={`progress-medium`} now={100} />
        </Col>
        <Col className="col-auto col-md-2 text-md-right text-gray-700 order-xs-3 order-md-4 font-weight-500">
          {props.valueStr}
        </Col>
      </Row>
    </>
  );
};
