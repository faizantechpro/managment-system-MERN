import { Image } from 'react-bootstrap';
import linkedin from '../../../assets/svg/linkedin.svg';
import twitter from '../../../assets/svg/twitter.svg';
import facebook from '../../../assets/svg/facebook.svg';
import React, { useState } from 'react';
import MaterialIcon from '../../commons/MaterialIcon';
import RocketReachViewInfoCard from './RocketReachViewInfoCard';
import TooltipComponent from '../../lesson/Tooltip';

const NameTooltip = ({ prospect, children }) => {
  return (
    <TooltipComponent title={prospect.full_name}>{children}</TooltipComponent>
  );
};

const SocialLink = ({ url, src }) => {
  return (
    <a href={url} rel="noreferrer" target="_blank">
      <Image src={src} className="mr-1" />
    </a>
  );
};

const ProfileIcon = ({ prospect, defaultSize }) => {
  const innerSize = defaultSize === 'xl' ? 'lg' : 'sm';
  return (
    <NameTooltip prospect={prospect}>
      <div
        className={`avatar avatar-${defaultSize} avatar-circle`}
        style={{ background: '#cfd7db' }}
      >
        <p className={`p-1 avatar-initials text-center avatar-icon-font-size`}>
          <span
            className={`avatar-${innerSize} rounded-circle avatar-circle text-white`}
            style={{ background: '#718594', color: '#cfd7db' }}
          >
            <MaterialIcon
              icon={prospect?.employees ? 'domain' : 'person'}
              style={{ verticalAlign: '-0.1em', fontSize: '1.7rem' }}
            />
          </span>
        </p>
      </div>
    </NameTooltip>
  );
};

const ProfilePicOrFallbackAvatar = ({ prospect, style }) => {
  const [fallbackImage, setFallbackImage] = useState('');

  const handleImageLoad = (el) => {
    try {
      const { src } = el.target;
      // rocket reach sending these paths 404, so filtering out them
      if (
        src.includes('encrypted-') ||
        src.includes('https://media.licdn.com/mpr/mpr/shrinknp_200_200')
      ) {
        setFallbackImage('default_icon');
      }
    } catch (e) {}
  };

  const handleImageLoadError = (el) => {
    el.onerror = null; // prevents looping
    setFallbackImage('default_icon');
  };

  return (
    <>
      {!fallbackImage && (
        <NameTooltip prospect={prospect}>
          <Image
            src={prospect.profile_pic}
            onLoad={(el) => handleImageLoad(el)}
            onError={(el) => handleImageLoadError(el)}
            className="rounded-circle"
            style={style}
          />
        </NameTooltip>
      )}
      {fallbackImage && (
        <ProfileIcon
          prospect={prospect}
          defaultSize={style.width === 80 ? 'xl' : 'lg'}
          sizeIcon={style.width === 80 ? 'fs-1' : 'fs-3'}
        />
      )}
    </>
  );
};

// withCompany: will show company if true
// withLocation: will show location if true
// Same component is being used from right prospect lookup under org/people profile and Find prospects table
const RocketReachPeopleCard = ({
  prospect,
  showSocialLinks = true,
  withCompany = true,
  withLocation = true,
  withContactInfo = false,
  avatarStyle = { width: 80, height: 80 },
  containerStyle,
}) => {
  return (
    <div className={`d-flex ${containerStyle}`}>
      <div className="mr-3">
        {prospect.profile_pic ? (
          <ProfilePicOrFallbackAvatar prospect={prospect} style={avatarStyle} />
        ) : (
          <ProfileIcon
            prospect={prospect}
            defaultSize={avatarStyle.width === 80 ? 'xl' : 'lg'}
            sizeIcon={avatarStyle.width === 80 ? 'fs-2' : 'fs-1'}
          />
        )}
      </div>
      <div className="text-left flex-grow-1">
        <p className="prospect-typography-h4 p-0 mb-0 text-wrap mw-fix-200 font-weight-semi-bold">
          {prospect.full_name}
        </p>
        <p className="prospect-typography-h6 p-0 mb-1 fs-7 text-wrap text-gray-900">
          {prospect.title}
        </p>
        {withLocation && prospect.location ? (
          <p className="prospect-typography-h6 p-0 mb-1">
            <span className="material-icons-outlined bg-gray-300 p-1 rounded-circle fs-7 text-black mr-1">
              location_on
            </span>
            <>
              {prospect.location ? (
                <span className="fs-7 text-gray-900">{prospect.location}</span>
              ) : (
                <span className="fs-7 text-gray-900">
                  {prospect.city && <span>{prospect.city}</span>}
                  {prospect.state && <span>, {prospect.state}</span>}{' '}
                </span>
              )}
            </>
          </p>
        ) : (
          ''
        )}
        {withCompany &&
        prospect.employer &&
        prospect.employer.toLowerCase() !== 'undefined' ? (
          <p className="prospect-typography-h6 p-0 m-0 text-wrap">
            <span className="material-icons-outlined mr-1 p-1 bg-gray-300 rounded-circle fs-7 text-black">
              corporate_fare
            </span>
            <span className="fs-7 text-gray-900">{prospect.employer}</span>
          </p>
        ) : (
          ''
        )}
        {showSocialLinks && (
          <div className="my-1 d-flex align-items-center">
            {prospect.linkedin_url && (
              <SocialLink url={prospect.linkedin_url} src={linkedin} />
            )}
            {prospect.facebook_url && (
              <SocialLink url={prospect.facebook_url} src={facebook} />
            )}
            {prospect.twitter_url && (
              <SocialLink url={prospect.twitter_url} src={twitter} />
            )}
          </div>
        )}
        {withContactInfo && (
          <RocketReachViewInfoCard
            prospect={prospect}
            layout="row"
            load={withContactInfo}
          />
        )}
      </div>
    </div>
  );
};

export default RocketReachPeopleCard;
