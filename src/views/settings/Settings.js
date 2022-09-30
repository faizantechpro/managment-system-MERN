import React, { useContext } from 'react';
import Heading from '../../components/heading';
import ValidateAdminAccess from '../../components/validateAdminAccess/ValidateAdminAccess';
import SettingCardItem from '../../components/commons/SettingCardItem';
import { BRANDING_LABEL } from '../../utils/constants';
import { TenantContext } from '../../contexts/TenantContext';
import { isMatchInCommaSeperated } from '../../utils/Utils';

const settingsValues = [
  {
    id: 1,
    title: 'Profile',
    icon: 'account_circle',
    path: '/profile',
  },
  {
    id: 3,
    title: 'Security',
    icon: 'security',
    path: '/security',
  },
  {
    id: 4,
    title: 'Notifications',
    icon: 'notifications',
    path: '/notifications',
  },
  {
    id: 5,
    title: 'Manage Users',
    icon: 'group_add',
    path: '/users',
    requiredAdminAccess: true,
  },
  {
    id: 7,
    title: 'Training',
    icon: 'school',
    path: '/training',
    requiredAdminAccess: true,
  },
  {
    id: 8,
    title: BRANDING_LABEL,
    icon: 'palette',
    path: '/branding',
    requiredAdminAccess: true,
  },
  {
    id: 9,
    title: 'Products',
    icon: 'app_registration',
    path: '/products',
    requiredAdminAccess: true,
  },
  {
    id: 10,
    title: 'Bulk Import',
    icon: 'upload',
    path: '/bulk-import',
    requiredAdminAccess: true,
  },
  {
    id: 11,
    title: 'Integrations',
    icon: 'view_comfy_alt',
    path: '/integrations',
    requiredAdminAccess: true,
  },
];

const Settings = () => {
  const { tenant } = useContext(TenantContext);
  const settingFiltered = settingsValues.filter((setting) => {
    if (tenant.modules === '*' || !tenant.modules) {
      return true;
    } else {
      const settingsInput = 'Setting-' + setting.title;
      return isMatchInCommaSeperated(tenant.modules, settingsInput);
    }
  });
  return (
    <>
      <Heading title="Settings" />
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 font-weight-medium">
        {settingFiltered.map((item) => (
          <ValidateAdminAccess
            validate={!!item?.requiredAdminAccess}
            key={item.id}
          >
            <div className="col mb-5">
              <SettingCardItem item={item} url={`/settings${item.path}`} />
            </div>
          </ValidateAdminAccess>
        ))}
      </div>
    </>
  );
};

export default Settings;
