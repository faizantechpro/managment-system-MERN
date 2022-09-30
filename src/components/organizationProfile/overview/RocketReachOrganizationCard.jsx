import { Image } from 'react-bootstrap';
import MaterialIcon from '../../commons/MaterialIcon';
import locationCircle from '../../../assets/svg/location-circle.svg';
import phoneCircle from '../../../assets/svg/phone-circle.svg';
import sicCircle from '../../../assets/svg/sic-circle.svg';
import naicsCircle from '../../../assets/svg/naics-circle.svg';
import tickerCircle from '../../../assets/svg/ticker-circle.svg';
import revenueCircle from '../../../assets/svg/revenue-circle.svg';
import foundedCircle from '../../../assets/svg/founded-circle.svg';
import webCircle from '../../../assets/svg/web-circle.svg';
import emailCircle from '../../../assets/svg/email-circle.svg';
import textCircle from '../../../assets/svg/text-circle.svg';

const pretty = (value) => {
  if (!value) {
    return 'N/A';
  }

  return value;
};

const LookupOrganizationItem = ({ label, text, icon }) => {
  return (
    <>
      {text !== 'N/A' && (
        <p className="m-0 p-0 lead fs-7 d-flex align-items-center py-1">
          <Image src={icon} className="mr-1" />
          <span>
            {label}: {text}
          </span>
        </p>
      )}
    </>
  );
};

const RocketReachOrganizationCard = ({
  prospect,
  showDescription = true,
  readMore,
  setReadMore,
}) => {
  const addressify = (comp) => {
    const address = [comp.address, comp.city].filter((a) => !!a).join(', ');
    return `${address || ''} ${comp.state || ''} ${comp.country || ''} ${
      comp.postal_code || ''
    }`;
  };

  return (
    <>
      <div className="d-flex align-items-center">
        <div className="mr-2">
          {prospect?.logo ? (
            <img src={prospect?.logo} width="54px" height="54px" />
          ) : (
            <span className="avatar-initials avatar-icon-font-size p-2 rounded-circle border-primary text-primary">
              <i className="material-icons-outlined avatar-icon-font-size-sm fs-3">
                business
              </i>
            </span>
          )}
        </div>
        <div>
          <h4 className="prospect-typography-h4 mb-0 text-left">
            {pretty(prospect.name)}
          </h4>
        </div>
      </div>

      <div className="text-left fs-7 mt-3">
        <p className="m-0 p-0 lead fs-7 py-1">
          <MaterialIcon
            icon="people"
            clazz="p-1 bg-gray-300 rounded-circle fs-7 text-black"
          />
          <span> Employees: {prospect.employees}</span>
        </p>

        <p className="m-0 p-0 lead fs-7 py-1">
          <Image src={locationCircle} className="mr-1" />
          <span>{addressify(prospect)}</span>
        </p>

        <LookupOrganizationItem
          label="Phone"
          text={pretty(prospect.phone)}
          icon={phoneCircle}
        />
        <LookupOrganizationItem
          label="SIC"
          text={pretty(prospect.sic)}
          icon={sicCircle}
        />
        <LookupOrganizationItem
          label="NAICS"
          text={pretty(prospect.naics)}
          icon={naicsCircle}
        />
        <LookupOrganizationItem
          label="Ticker"
          text={pretty(prospect.ticker)}
          icon={tickerCircle}
        />
        <LookupOrganizationItem
          label="Revenue"
          text={pretty(prospect.revenue)}
          icon={revenueCircle}
        />
        <LookupOrganizationItem
          label="Founded"
          text={pretty(prospect.founded)}
          icon={foundedCircle}
        />
        <LookupOrganizationItem
          label="Website"
          text={pretty(prospect.domain)}
          icon={webCircle}
        />
        <LookupOrganizationItem
          label="E-mail"
          text={pretty(prospect.email_domain)}
          icon={emailCircle}
        />

        {showDescription && prospect?.description && (
          <div className="m-0 p-0 py-1">
            <Image src={textCircle} className="mr-1" />
            <span>
              Description: <br />{' '}
              <span
                style={{
                  display: 'block',
                  height: readMore ? '100%' : '50px',
                  overflow: 'hidden',
                }}
              >
                <p className="lead fs-7">{prospect?.description}</p>
              </span>
              {!readMore && (
                <a
                  href="#!"
                  className="text-primary"
                  onClick={() => setReadMore(true)}
                >
                  Read More
                </a>
              )}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default RocketReachOrganizationCard;
