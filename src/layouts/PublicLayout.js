import React, { useEffect, useState } from 'react';

import FullScreenSpinner from '../components/FullScreeenSpinner';
import { useTenantContext } from '../contexts/TenantContext';
import BrandLogoIcon from '../components/sidebar/BrandLogoIcon';

export const PublicLayout = ({ children, title }) => {
  const [mounted, setMounted] = useState(false);

  const { tenant } = useTenantContext();

  const setTheme = () => {
    if (tenant?.colors) {
      document.documentElement.style.setProperty(
        '--primaryColor',
        tenant.colors.primaryColor
      );
      document.documentElement.style.setProperty(
        '--secondaryColor',
        tenant.colors.secondaryColor
      );
    }
  };

  useEffect(() => {
    setTheme();
    tenant?.id && !mounted && setMounted(true);
  }, [tenant]);

  if (mounted) {
    return (
      <main id="content" role="main" className="main">
        <div className="container py-8 py-sm-7">
          <div className="d-flex justify-content-center mt-5 mb-5">
            <BrandLogoIcon tenant={tenant} />
          </div>
          {children}
        </div>
      </main>
    );
  } else return <FullScreenSpinner />;
};
