import React, { useState, useEffect } from 'react';

import { useProfileContext } from '../../contexts/profileContext';

const ValidateAdminAccess = ({
  validate = true,
  onlyAdmin = false,
  onlyOwner = false,
  children,
}) => {
  const { profileInfo } = useProfileContext();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    const isAdmin = profileInfo?.roleInfo?.admin_access;
    const isOwner = profileInfo?.roleInfo?.owner_access;

    if (!validate) {
      // Validation is not required
      setHasAdminAccess(true);
    } else if (onlyAdmin) {
      setHasAdminAccess(isAdmin);
    } else if (onlyOwner) {
      setHasAdminAccess(isOwner);
    } else if (isAdmin || isOwner) {
      setHasAdminAccess(true);
    } else {
      setHasAdminAccess(false);
    }
  }, [profileInfo]);

  return <>{hasAdminAccess && children}</>;
};

export default ValidateAdminAccess;
