import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Badge } from 'reactstrap';

import { formatNumber } from '../../../utils/Utils';
import stringConstants from '../../../utils/stringConstants.json';
import { renderValueField } from '../../peoples/constantsPeople';

const constants = stringConstants.deals.contacts.profile;

const OrgCardRow = ({ left, right, margin = 4 }) => {
  return (
    <Row>
      <Col md={margin}>{left}</Col>
      <Col>{right}</Col>
    </Row>
  );
};

const items = {
  phone_office: constants.phoneLabel,
  annual_revenue: constants.totalRevenue,
  employees: constants.employeesLabel,
  website: constants.websiteLabel,
  naics_code: constants.naicsCodeLabel,
  industry: constants.industryLabel,
};

const ItemList = ({ value = '', name }) => {
  if (name === 'annual_revenue') value = formatNumber(value, 2);

  const left = (
    <span className="text-muted font-weight-medium mr-2">{items[name]}</span>
  );
  const right = <span className="font-weight-medium ml-auto">{value}</span>;
  return (
    <li className="list-group-item">
      <OrgCardRow
        left={left}
        right={
          name === 'website' ? (
            <a
              href={value.includes('http') ? value : 'https://' + value}
              target="_blank"
              rel="noopener noreferrer"
            >
              {right}
            </a>
          ) : (
            right
          )
        }
        margin={6}
      />
    </li>
  );
};

const nameDetails = (data) => {
  return (
    <>
      <li className="list-group-item">
        <OrgCardRow
          left={
            <span className="text-muted text-capitalize">
              {constants.nameLabel}
            </span>
          }
          right={
            <span className="font-weight-medium ml-auto"> {data.name} </span>
          }
          margin={6}
        />
      </li>
      <li className="list-group-item">
        <OrgCardRow
          left={<span className="text-muted">{constants.statusLabel}</span>}
          right={
            <span className="font-weight-medium text-right ml-auto">
              <Badge
                id={data?.label?.id}
                style={{
                  fontSize: '12px',
                  backgroundColor: `${data?.label?.color}`,
                }}
                className="text-uppercase"
              >
                {data?.label?.name}
              </Badge>
            </span>
          }
          margin={6}
        />
      </li>
    </>
  );
};

const getEncodedURL = (data) => {
  const string =
    (data.address_street || '') +
    (data.address_city || '') +
    (data.address_state ? ', ' : '') +
    (data.address_state || '') +
    (data.address_postalcode || '') +
    (data.address_country || '');

  const encodedurl = encodeURIComponent(string);
  return encodedurl;
};

const Organization = ({ data, peopleContact = false }) => {
  return (
    <div className="card-body toggle-org py-2">
      <ul className="list-group list-group-flush list-group-no-gutters">
        {peopleContact && nameDetails(data)}
        <li className="list-group-item">
          <OrgCardRow
            left={<span className="text-muted">{constants.addressLabel}</span>}
            right={
              <span className="font-weight-medium text-right ml-auto">
                <a
                  target={'_blank'}
                  rel="noreferrer"
                  href={`https://www.google.com/maps/search/?api=1&query=${getEncodedURL(
                    data
                  )}`}
                >
                  <span>{data.address_street || ''}</span>
                  <span>{data.address_city || ''}</span>
                  <span>
                    {data.address_state ? ',' : ''} {data.address_state || ''}
                  </span>
                  <span>{data.address_postalcode || ''}</span>
                  <span>{data.address_country || ''}</span>
                </a>
              </span>
            }
            margin={6}
          />
        </li>

        {Object.keys(items).map((key) => {
          return <ItemList value={data?.[key] || ''} key={key} name={key} />;
        })}

        {data?.fields &&
          data?.fields?.map((item) => {
            const { id, field, value } = item;
            return (
              <li key={id} className="list-group-item">
                <OrgCardRow
                  left={
                    <span className="text-muted text-capitalize">
                      {field.key}
                    </span>
                  }
                  right={
                    <span className="font-weight-medium ml-auto">
                      {renderValueField(field.field_type, value)}
                    </span>
                  }
                  margin={6}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Organization;
