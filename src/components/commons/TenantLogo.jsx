import React, { useEffect, useState } from 'react';
import avatarService from '../../services/avatar.service';

const TenantLogo = ({
  tenant,
  imageStyle = 'ml-2',
  width = '90px',
  isIcon,
}) => {
  const [tenantLogo, setTenantLogo] = useState(null);

  useEffect(async () => {
    if (tenant && tenant.logo) {
      const logo = await avatarService.getAvatarMemo(tenant.logo, true);
      setTenantLogo(logo);
    } else {
      setTenantLogo(null);
    }
  }, [tenant]);

  return (
    <>
      {tenantLogo ? (
        <img
          className={imageStyle}
          style={{ objectFit: 'contain', width }}
          src={tenantLogo?.url}
          alt={tenant?.name}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default TenantLogo;
