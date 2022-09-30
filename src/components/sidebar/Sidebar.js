import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { CategoriesContext } from '../../contexts/categoriesContext';
import { LearningPathContext } from '../../contexts/LearningPathContext';
import SidebarIcon from './SidebarIcon';
import SubMenuWrapper from './SubMenuWrapper';
import { sidebarData } from './constants/Sidebar.constants';
import { ToggleMenuContext } from '../../contexts/toogleMenuContext';
import { useViewport } from '../../contexts/viewportContext';
import { TenantContext } from '../../contexts/TenantContext';
import {
  PermissionsWrapper,
  isMatchInCommaSeperated,
  isModuleAllowed,
} from '../../utils/Utils';

function Item(props) {
  const history = useHistory();
  const { title, icon, path, setActive: setActiveSlide } = props; // TODO: permissions

  const [active, setActive] = useState('');

  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === path ||
      (path !== '/' && location.pathname.includes(path))
    ) {
      if (setActiveSlide) setActiveSlide('');
      return setActive('active');
    }

    setActive('');
  }, [location]);

  return (
    // TODO: Permissions view strategy
    <li className="nav-item">
      <div
        className={`js-nav-tooltip-link nav-link cursor-pointer fw-bold ${active}`}
        onClick={() => history.push(path)}
      >
        {icon && <i className="material-icons-outlined nav-icon">{icon}</i>}
        <span
          className={`navbar-vertical-aside-mini-mode-hidden-elements text-truncate fw-bold ${
            path?.includes('/training/categories') ? 'pl-2' : ''
          }`}
        >
          {title}
        </span>
      </div>
    </li>
  );
}

function SubMenu({
  icon,
  title,
  items,
  permissions,
  active,
  setActive,
  ...restProps
}) {
  function renderItem(subItem) {
    if (subItem.submenu) {
      const [subActive, setSubActive] = useState('');

      useEffect(() => {
        setSubActive('');
      }, [active]);

      return (
        <SubMenuWrapper
          key={`${subItem.id}-${subItem.path}`}
          title={subItem.title}
          active={subActive}
          setActive={setSubActive}
          {...restProps}
        >
          {subItem.items?.map((item) => (
            <Item
              key={`${item.id}-${item.path}`}
              path={item.path}
              title={item.title}
              permissions={item.permissions}
            />
          ))}
        </SubMenuWrapper>
      );
    }

    return (
      <Item
        key={`${subItem.id}-${subItem.path}`}
        path={subItem.path}
        title={subItem.title}
        permissions={subItem.permissions}
      />
    );
  }

  return (
    // TODO: Permissions view strategy
    <SubMenuWrapper
      icon={icon}
      title={title}
      active={active}
      setActive={setActive}
      {...restProps}
    >
      {items?.map((item) => renderItem(item))}
    </SubMenuWrapper>
  );
}

function MenuItem(props) {
  const { submenu, ...restProps } = props;

  if (submenu) return <SubMenu {...restProps} />;

  return <Item {...restProps} />;
}

function SidebarMenu({ allMenuItems, active, setActive }) {
  return (
    <div className="navbar-vertical-content bg-light pt-3 pt-lg-4 pb-4">
      <ul className="navbar-nav navbar-nav-lg nav-tabs font-weight-medium font-size-md">
        {allMenuItems?.map((sidebarItem) => (
          <div key={`${sidebarItem.id}-${sidebarItem.path}`}>
            {sidebarItem.permissions ? (
              PermissionsWrapper({
                collection: sidebarItem.permissions.collection,
                action: sidebarItem.permissions.action,
                children: (
                  <MenuItem
                    path={sidebarItem.path}
                    icon={sidebarItem.icon}
                    title={sidebarItem.title}
                    submenu={sidebarItem.submenu}
                    items={sidebarItem.items}
                    permissions={sidebarItem.permissions}
                    active={active}
                    setActive={setActive}
                  />
                ),
              })
            ) : (
              <MenuItem
                path={sidebarItem.path}
                icon={sidebarItem.icon}
                title={sidebarItem.title}
                submenu={sidebarItem.submenu}
                items={sidebarItem.items}
                permissions={sidebarItem.permissions}
                active={active}
                setActive={setActive}
              />
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

function SidebarContent({ sidebarData, tenant }) {
  const [active, setActive] = useState('');

  return (
    <>
      <div className="navbar-vertical-container">
        <div className="navbar-vertical-footer-offset pt-2">
          <SidebarIcon />

          <SidebarMenu
            allMenuItems={sidebarData}
            active={active}
            setActive={setActive}
          />
        </div>
      </div>
      {isModuleAllowed(tenant.modules, 'Settings') && (
        <div className="navbar-vertical-footer bg-light p-0 py-2">
          <ul className="navbar-nav navbar-nav-lg nav-tabs font-weight-medium font-size-md">
            <MenuItem
              path="/settings"
              icon="settings"
              title="Settings"
              setActive={setActive}
            />
          </ul>
        </div>
      )}
    </>
  );
}

export default function Sidebar() {
  const [tenantMenu, setTenantMenu] = useState(null);
  const { tenant } = useContext(TenantContext);
  const { categoryList } = useContext(CategoriesContext);
  const { learningList } = useContext(LearningPathContext);
  const { isOpen } = useContext(ToggleMenuContext);
  const { width } = useViewport();

  useEffect(() => {
    if (tenant?.modules) {
      const tenantMenuData = sidebarData.filter((el) => {
        if (!tenant.modules || tenant.modules === '*') {
          return true;
        } else {
          return isMatchInCommaSeperated(tenant.modules, el.title);
        }
      });

      const resourceObject = tenantMenuData.find(
        (data) => data.title === 'Training'
      );

      resourceObject?.items?.map((item) => {
        if (item.title === 'Explore') {
          item.items = categoryList;
        }

        if (item.title === 'Learning Path') {
          item.items = learningList;
        }

        return item;
      });
      console.log(JSON.stringify(tenant.modules));
      console.log(JSON.stringify(tenantMenuData));
      setTenantMenu(tenantMenuData);
    }
  }, [tenant]);

  const navbarDirection =
    width < 1200
      ? 'navbar-horizontal-fixed sidebar-collapse sidebar-mobile'
      : 'navbar-vertical-fixed';

  return (
    <>
      <div
        className={`js-navbar-vertical-aside navbar navbar-vertical-aside fw-bold navbar-vertical ${navbarDirection} navbar-expand-xl navbar-bordered navbar-light  ${
          width < 1200 && !isOpen && 'collapse'
        }`}
      >
        {tenant && tenantMenu && (
          <SidebarContent sidebarData={tenantMenu} tenant={tenant} />
        )}
      </div>
    </>
  );
}
