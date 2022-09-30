import React from 'react';
import Heading from '../components/heading';
import SettingCardItem from '../components/commons/SettingCardItem';

const integrationImagesBasePath = '/img/integrations';

const integrationItems = [
  {
    id: 1,
    title: 'Creditsafe',
    logo: `${integrationImagesBasePath}/Creditsafe-Logo.png`,
    isActive: false,
    isDisabled: true,
  },
  {
    id: 2,
    title: 'US Faster Payments Council',
    logo: `${integrationImagesBasePath}/FasterPayments-Logo.jpeg`,
    isActive: true,
  },
  {
    id: 3,
    title: 'Fee Navigator',
    logo: `${integrationImagesBasePath}/FeeNavigator-Logo.png`,
    isActive: false,
    isDisabled: true,
    logoStyle: { width: 190 },
  },
  {
    id: 4,
    title: 'FIS',
    logo: `${integrationImagesBasePath}/FIS-Logo.png`,
    isActive: false,
    isDisabled: true,
    logoStyle: { width: 90 },
  },
  {
    id: 5,
    title: 'Fiserv.',
    logo: `${integrationImagesBasePath}/Fiserv-Logo.png`,
    isActive: false,
    isDisabled: true,
    logoStyle: { width: 80 },
  },
  {
    id: 6,
    title: 'Jack Henry Banking',
    logo: `${integrationImagesBasePath}/jack-henry-logo.svg`,
    isActive: false,
    isDisabled: true,
  },
  {
    id: 7,
    title: 'Rocket Reach',
    logo: `${integrationImagesBasePath}/RocketReach-Logo.svg`,
    isActive: true,
    logoStyle: { width: 60, height: 60 },
  },
  {
    id: 8,
    title: 'RPMG',
    logo: `${integrationImagesBasePath}/RPMG-Logo.png`,
    isActive: true,
  },
  {
    id: 9,
    title: 'Salesforce',
    logo: `${integrationImagesBasePath}/salesforce.png`,
    isActive: false,
    isDisabled: true,
    logoStyle: { width: 80 },
  },
  {
    id: 10,
    title: 'SP Global',
    logo: `${integrationImagesBasePath}/sp-global.png`,
    isActive: true,
  },
  {
    id: 11,
    title: 'DocuSign',
    logo: `${integrationImagesBasePath}/docusign.svg`,
    isActive: false,
    isDisabled: true,
    logoStyle: { width: 110 },
  },
];

const Integrations = () => {
  const sortAlphabetically = (a, b) => a.title.localeCompare(b.title);
  return (
    <>
      <Heading title="Integrations" />
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 font-weight-medium">
        {integrationItems.sort(sortAlphabetically).map((item) => (
          <div key={item.id} className="col mb-5 position-relative">
            <SettingCardItem item={item} url={`#!`} iconOrLogo={false} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Integrations;
