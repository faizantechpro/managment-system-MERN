import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import BrandLogoIcon from './BrandLogoIcon';
import { TenantContext } from '../../contexts/TenantContext';

function SidebarIcon() {
  const { tenant } = useContext(TenantContext);
  const history = useHistory();

  return (
    <div className="navbar-brand-wrapper justify-content-between">
      <a
        className="navbar-brand text-center cursor-pointer"
        onClick={() => history.push('/')}
        aria-label="Identifee"
      >
        <BrandLogoIcon tenant={tenant} />
      </a>
      <button
        type="button"
        className="js-navbar-vertical-aside-toggle-invoker navbar-vertical-aside-toggle btn btn-icon btn-xs btn-ghost-light"
      >
        <i className="material-icons-outlined font-size-ml">clear</i>
      </button>
    </div>
  );
}

export default SidebarIcon;
