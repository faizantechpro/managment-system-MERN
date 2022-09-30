import MaterialIcon from '../../commons/MaterialIcon';
import { CardButton } from '../../layouts/CardLayout';
import React, { useEffect, useState } from 'react';
import prospectService from '../../../services/prospect.service';
import IconTextLoader from '../../loaders/IconText';
import _ from 'lodash';
import RocketReachSocialLinks from './RocketReachSocialLinks';

const Count = ({ count, text, icon }) => {
  return (
    <div className="d-flex fs-7 align-items-center mr-4">
      <MaterialIcon
        icon={icon}
        clazz="p-1 bg-gray-300 rounded-circle fs-7 text-black mr-1"
      />
      <span className="text-gray-900 font-weight-semi-bold">
        {' '}
        {count} {text}
      </span>
    </div>
  );
};

const Detail = ({ full, text, icon }) => {
  return (
    <div className="d-flex my-1 fs-8 align-items-center ml-1">
      {(full?.type === 'professional' || full?.type === 'personal') &&
      full?.is_verified ? (
        <span
          className={`badge ${
            icon === 'phone'
              ? 'bg-white text-green-900'
              : 'badge-success text-white'
          } badge-sm p-0 rounded-circle d-inline-block mr-1`}
        >
          <MaterialIcon
            icon={icon === 'phone' ? 'phone' : 'check'}
            clazz={`${
              icon === 'phone' ? 'text-green-900 fw-bold' : 'text-white'
            } fs-7`}
          />{' '}
        </span>
      ) : (
        <MaterialIcon
          icon={icon}
          clazz={`p-1 rounded-circle fs-7 mr-1 bg-gray-300 text-black`}
        />
      )}
      <span className="text-gray-900">{text} </span>
    </div>
  );
};

// this component contains all the logic for bottom "found" section according to figma design
// contains expand/collapse for emails/phones
// using same component in org profile right bar lookup and Find prospects page table, adjusting layout according
// load true means hit the api
const RocketReachViewInfoCard = ({
  prospect,
  setProspect,
  load = false,
  layout = 'row',
}) => {
  const [viewDetail, setViewDetail] = useState(false);
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [organization, setOrganization] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInfoLoaded, setIsInfoLoaded] = useState(false);
  const [socialLinks, setSocialLinks] = useState({});

  const componentLayout = {
    heading: layout === 'row' ? '' : '',
    container:
      layout === 'row'
        ? ` flex-row ${
            viewDetail
              ? 'align-items-end justify-content-end'
              : 'align-items-center'
          }`
        : 'flex-column justify-content-start align-items-start rr-card-width',
    btn: layout === 'row' ? '' : ' btn-block mt-2 ',
  };

  // specifically formatting US number, its usage is in this component only, if required anywhere else will move to generic file
  const formatUSNumber = (phoneNumberString) => {
    if (phoneNumberString.includes('+')) {
      return phoneNumberString;
    }
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return ['(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return phoneNumberString;
  };

  const getContactInfo = async (pros) => {
    try {
      setIsLoading(true);
      const { data } = await prospectService.getContact({ id: pros.id });
      const dataOrganization =
        pros.organization ||
        (await prospectService.getCompanyRR(pros.employer));

      setIsLoading(false);
      setIsInfoLoaded(true);
      setSocialLinks(data.links);

      // checking these nodes to match them below
      const recommendedEmails = [
        data.recommended_email,
        data.recommended_personal_email,
        data.recommended_professional_email,
      ];
      const verifiedEmails = [];

      // if email found in emails then mark it verified
      recommendedEmails.forEach((email) => {
        if (email) {
          const emailFound = data.emails.find(
            (em) => em.smtp_valid === 'valid' && em.email === email
          );
          if (emailFound) {
            emailFound.is_verified = true;
            verifiedEmails.push(emailFound);
          }
        }
      });

      setEmails(_.uniqBy(verifiedEmails, 'email'));

      // hardcoding first object to show tick mark with it for phones
      let onlyVerifiedPhone = '';
      if (data.phones && data.phones.length) {
        data.phones[0].is_verified = true;
        data.phones[0].type = 'professional';
        onlyVerifiedPhone = data.phones[0];
        setPhones([onlyVerifiedPhone]);
      }
      setOrganization(dataOrganization);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleViewInfo = (pros) => {
    setViewDetail(!viewDetail);
    if (!viewDetail) {
      getContactInfo(pros);
    } else {
      setIsLoading(false);
      setIsInfoLoaded(false);
    }
  };

  useEffect(() => {
    if (load) {
      setOrganization(prospect.organization || {});
      if (prospect.emails_list || prospect.phones_list) {
        setViewDetail(!viewDetail);
        setIsLoading(false);
        setIsInfoLoaded(true);
        setEmails(prospect.emails_list || emails);
        setPhones(prospect.phones_list || phones);
      } else {
        toggleViewInfo(prospect);
      }
    }
  }, []);

  useEffect(() => {
    if (emails && emails.length) {
      // once we have loaded it, dont call again RR to fetch these
      prospect.emails_list = emails;
      prospect.work_email = emails[0].email;
    }
    if (phones && phones.length) {
      // once we have loaded it, dont call again RR to fetch these
      prospect.phones_list = phones;
      prospect.work_phone = phones[0].number;
    }
    if (prospect.links) {
      setSocialLinks(prospect.links);
    }
    if (organization && organization.name) {
      prospect.organization = organization;
    }
    setProspect && setProspect(prospect);
  }, [emails, phones, organization]);

  const EmailPhone = () => {
    return (
      <>
        {isLoading && (
          <div className="w-100">
            {' '}
            <IconTextLoader count={3} />
          </div>
        )}
        {isInfoLoaded && !isLoading && (
          <div>
            {emails?.map((email) => (
              <Detail
                full={email}
                key={email.email}
                text={email.email}
                icon="email"
              />
            ))}
            {phones?.map((phone) => (
              <Detail
                full={phone}
                key={phone.number}
                text={formatUSNumber(phone.number)}
                icon="phone"
              />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {!load &&
        (prospect.teaser?.emails.length > 0 ||
          prospect.teaser?.phones.length > 0) && (
          <div className="text-left mb-2">
            <div className={`d-flex ${componentLayout.container}`}>
              {!viewDetail && (
                <div className="d-flex align-items-center flex-grow-1">
                  {prospect.teaser?.emails.length > 0 && (
                    <Count
                      count={prospect.teaser.emails.length}
                      text="Emails"
                      icon="email"
                    />
                  )}
                  {prospect.teaser?.phones.length > 0 && (
                    <Count
                      count={prospect.teaser.phones.length}
                      text="Phones"
                      icon="phone"
                    />
                  )}
                </div>
              )}
              {viewDetail && layout === 'column' && <EmailPhone />}
              {!isInfoLoaded && !viewDetail && (
                <CardButton
                  type="button"
                  icon="visibility"
                  title={viewDetail ? 'Hide Info' : 'View Info'}
                  variant="white"
                  className={`btn-sm ${componentLayout.btn}`}
                  onClick={() => toggleViewInfo(prospect)}
                />
              )}
            </div>
            {viewDetail && layout === 'row' && <EmailPhone />}
          </div>
        )}
      {load && <EmailPhone />}
      {load && isInfoLoaded && <RocketReachSocialLinks links={socialLinks} />}
    </>
  );
};

export default RocketReachViewInfoCard;
