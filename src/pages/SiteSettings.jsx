import React from 'react';

import Heading from '../components/heading';
import SiteSettingsForm from '../components/siteSettings/SiteSettingsForm';
import { BRANDING_LABEL } from '../utils/constants';

const SiteSettings = () => {
  return (
    <>
      <Heading title={BRANDING_LABEL} useBc />
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <SiteSettingsForm />
        </div>
      </div>
    </>
  );
};

export default SiteSettings;
