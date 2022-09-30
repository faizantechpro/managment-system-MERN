import { startCase } from 'lodash';
import React from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';

import {
  TreasuryInput,
  TreasuryService,
} from 'lib/database/models/report/report';
import { toUSD } from 'lib/utils/currency';
import { imgAsBinary, TreasuryOutput } from '../utils';

export type Props = {
  updated_at: string | Date;
  input: TreasuryInput;
  output: TreasuryOutput;
};

export const Component = (props: Props) => {
  const renderDate = new Date(props.input.date);
  return (
    <>
      <div className="main">
        <div className="cover-img">
          <img
            src={imgAsBinary(
              `/templates/reports/types/${props.input.type}/img/cover.png`
            )}
          />
          <div className="left-placement bank-logo-wide">
            <img src={props.input.logo_dark} />
          </div>
          <div className="left-placement main-title">
            Treasury Management Proposal
          </div>
          <div className="left-placement sub-title">
            {props.input.client_name}
          </div>
          <div className="left-placement date-title">
            {renderDate.toLocaleString('default', { month: 'long' })}{' '}
            {renderDate.getFullYear()}
          </div>
        </div>
      </div>
      <div className="main">
        <div className="banner-treasure">
          <img
            className="banner-treasure-header"
            src={imgAsBinary(
              `/templates/reports/types/${props.input.type}/img/page-2-header.png`
            )}
          />
          <div className="banner-text">
            <h4 className="header">Pricing Comparison</h4>
            <p className="text">
              How do we compare vs. your current bank partner?
            </p>
          </div>
          <TreasuryCalculation {...props} />
        </div>
      </div>
    </>
  );
};

/**
 * Component which uses calculated output to derive charts
 */
export const TreasuryCalculation = (props: Props) => {
  const hasSavings = props.output.annual_estimated_savings > 0;
  const estimatedReturnStr = hasSavings ? 'savings' : 'losses';
  const wholeUSDStr = toUSD(props.output.annual_estimated_savings);

  return (
    <>
      <h4 className="left-placement header header-total-estimated">
        {startCase(`Total estimated ${estimatedReturnStr}`)}
      </h4>
      <span
        className={`${hasSavings ? `text-success` : `text-danger`} ${
          wholeUSDStr.length > 8 ? `display-5` : `display-4`
        } estimated estimated-value`}
      >
        {`${wholeUSDStr}`}
      </span>
      <p className="estimated estimated-text text">
        {`Estimated annual ${estimatedReturnStr} by switching to ${props.input.proposed_bank_name}.`}
      </p>
      <div className="left-placement proposed-pricing">
        <h4 className="header">Proposed Pricing</h4>
        <p className="text">
          A pricing comparison of the top products & services you currently use.
        </p>
      </div>

      <div className="left-placement comparison">
        <Row style={{ marginBottom: '45px', height: '20px' }}>
          <Col sm={5} className="pb-legend-left">
            <Row style={{ height: 'fill' }}>
              <Col sm={10} style={{ paddingRight: '0px' }}>
                <div className="pb-text">
                  <span className="pb-legend-comparison-text">
                    {props.input.proposed_bank_name}
                  </span>
                </div>
              </Col>
              <Col sm={2}>
                <ProgressBar
                  className="fill"
                  variant={'pb-comparison'}
                  now={100}
                />
              </Col>
            </Row>
          </Col>
          <Col sm={2} className="pb-col-inner" />
          <Col sm={5} className="pb-legend-right">
            <Row style={{ height: 'fill' }}>
              <Col sm={2}>
                <ProgressBar
                  className="fill"
                  variant={'pb-current'}
                  now={100}
                />
              </Col>
              <Col sm={10} style={{ paddingLeft: '0px' }}>
                <div className="pb-text">
                  <span className="pb-legend-current-text">Current Bank</span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {props.output.services.map((service, idx) => {
          return (
            <CompareProgressBarUSD
              key={idx}
              {...service}
            ></CompareProgressBarUSD>
          );
        })}

        <Row style={{ marginTop: '15px' }}>
          <Col sm={1} className="pb-col-left" />
          <Col sm={10} className="pb-col-inner">
            <p style={{ textAlign: 'center', fontSize: '13px' }}>
              {`*Based on your statement provided to ${props.input.proposed_bank_name}.`}
              {`This is an estimate. Actual fees are determined by average balance and product usage. See Pricing Proforma for additional details.`}
            </p>
          </Col>
          <Col sm={1} className="pb-col-right" />
        </Row>

        <img
          style={{ width: '120px !important', marginTop: '50px' }}
          src={props.input.logo_dark}
        />
      </div>
    </>
  );
};

export const CompareProgressBarUSD = (props: TreasuryService) => {
  return CompareProgressBar({
    name: props.name,
    proposedValue: props.proposed_item_fee,
    proposedValueStr: toUSD(props.proposed_item_fee),
    value: props.item_fee,
    valueStr: toUSD(props.item_fee),
  });
};

export const CompareProgressBar = (props: {
  name: string;
  proposedValue: number;
  proposedValueStr: string; // with unit
  value: number;
  valueStr: string; // with unit
}) => {
  // TODO what if proposed value is higher?
  const savingsPercentage = (props.proposedValue / props.value) * 100;

  return (
    <>
      <Row style={{ marginBottom: '45px', height: '25px' }}>
        <Col sm={3} className="pb-col-left">
          <div className="pb-text">
            <span className="comparison-proposed-text">
              {props.proposedValueStr}
            </span>
          </div>
        </Col>
        <Col sm={6} className="pb-col-inner">
          <Row className="pb-row-inner" style={{ height: 'fill' }}>
            <Col sm={4} className="pb-col-inner">
              <ProgressBar
                className="fill flex-row-reverse"
                variant={'pb-comparison'}
                now={savingsPercentage}
              />
            </Col>
            <Col
              sm={4}
              className="pb-col-inner"
              style={{ textAlign: 'center' }}
            >
              <div className="pb-text">
                <span>{props.name}</span>
              </div>
            </Col>
            <Col sm={4} className="pb-col-inner">
              <ProgressBar className="fill" variant={'pb-current'} now={100} />
            </Col>
          </Row>
        </Col>
        <Col sm={3} className="pb-col-right comparison-text">
          <div className="pb-text">
            <span className="comparison-text">{props.valueStr}</span>
          </div>
        </Col>
      </Row>
    </>
  );
};
