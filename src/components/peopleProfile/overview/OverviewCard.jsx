import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { renderValueField } from '../../peoples/constantsPeople';

const basicItems = {
  first_name: 'First name',
  last_name: 'Last name',
};

const contactItems = {
  phone_work: 'Work',
  phone_mobile: 'Mobile',
  phone_home: 'Home',
  phone_other: 'Other',
};

const emailItems = {
  email_work: 'Work',
  email_home: 'Personal',
  email_other: 'Other',
};

const margin = 6;

const ItemBasic = ({ value = '', name, contactType = '' }) => {
  const right = <span className="font-weight-medium ml-auto">{value}</span>;
  const rightExt = (
    <span className="font-weight-medium ml-auto">{contactType}</span>
  );
  return (
    <li className="list-group-item">
      <Row>
        <Col md={margin}>
          {<span className="text-muted font-weight-medium mr-2">{name}</span>}
        </Col>
        <Col>
          {name === 'Email' ? (
            <a
              href={`mailto:${value}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {right}
            </a>
          ) : (
            right
          )}
          {rightExt}
        </Col>
      </Row>
    </li>
  );
};

const OverviewCard = ({ overviewData = [] }) => {
  return (
    <div className="card-body py-2">
      <ul className="list-group list-group-flush list-group-no-gutters">
        {Object.keys(basicItems).map((key) => {
          return (
            <ItemBasic
              value={overviewData?.[key] || ''}
              key={key}
              name={basicItems[key]}
            />
          );
        })}

        {Object.keys(contactItems)
          .filter((key) => overviewData?.[key])
          .map((key) => {
            return (
              <ItemBasic
                value={(overviewData?.[key] || '') + ' '}
                contactType={
                  overviewData?.[key] ? `(${contactItems[key]})` : ''
                }
                key={key}
                name={'Phone'}
              />
            );
          })}

        {Object.keys(emailItems)
          .filter((key) => overviewData?.[key])
          .map((key) => {
            return (
              <ItemBasic
                value={(overviewData?.[key] || '') + ' '}
                contactType={overviewData?.[key] ? `(${emailItems[key]})` : ''}
                key={key}
                name={'Email'}
              />
            );
          })}

        {overviewData?.fields &&
          overviewData?.fields?.map((item) => {
            const { id, field, value } = item;
            return (
              <ItemBasic
                value={renderValueField(field.field_type, value)}
                key={id}
                name={field.key}
              />
            );
          })}
      </ul>
    </div>
  );
};

export default OverviewCard;
