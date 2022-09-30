import React, { useEffect, useState } from 'react';
import avatarService from '../../services/avatar.service';

const CategoryPartnerLogo = ({
  categoryInfo,
  imageStyle = 'ml-2',
  width = '90px',
}) => {
  const [partnerLogo, setPartnerLogo] = useState(null);

  useEffect(async () => {
    if (categoryInfo && categoryInfo.logo) {
      const logo = await avatarService.getAvatarMemo(categoryInfo.logo);
      setPartnerLogo(logo);
    } else {
      setPartnerLogo(null);
    }
  }, [categoryInfo]);

  return (
    <>
      {partnerLogo ? (
        <img
          className={imageStyle}
          style={{ objectFit: 'contain', width }}
          src={partnerLogo?.url}
          alt={categoryInfo?.name}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default CategoryPartnerLogo;
