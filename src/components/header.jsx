import React, { useState, useEffect, useContext } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useHistory, Link } from 'react-router-dom';

import authService from '../services/auth.service';
import UserService from '../services/user.service';
import Avatar from './Avatar';
import { useProfileContext } from '../contexts/profileContext';
import { useAppContext } from '../contexts/appContext';
import { ToggleMenuContext } from '../contexts/toogleMenuContext';
import HelpCenter from './helpCenter/HelpCenter';
import { PROFILE_LABEL, SIGN_OUT } from '../utils/constants';
import { Col, Row } from 'react-bootstrap';
import { TenantContext } from '../contexts/TenantContext';
import Breadcrumb from '../utils/Breadcrumb';
import routes from '../utils/routes.json';

export default function Header() {
  const { tenant } = useContext(TenantContext);
  const history = useHistory();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const { profileInfo, setProfileInfo } = useProfileContext();

  const { userHasAuthenticated } = useAppContext();
  const { setOpen } = useContext(ToggleMenuContext);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    UserService.getUserInfo()
      .then((profileResult) => {
        setProfile(profileResult);
        setProfileInfo(profileResult);
      })
      .catch((err) => console.error(err));
  }, []);

  const logout = () => {
    authService.logout();
    userHasAuthenticated(false);
    setProfileInfo({});
    history.push('/login');
  };

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      ...profileInfo,
    }));
  }, [profileInfo]);

  useEffect(() => {
    const screen = window.screen;

    if (screen.width < 1200) setOpen(false);
  }, [history.location, setOpen]);

  return (
    <header
      id="header"
      className="navbar navbar-expand-lg navbar-fixed navbar-height navbar-flush border-bottom pr-0 navbar-container"
    >
      <div className="navbar-nav-wrap">
        <div
          className="mr-2 d-xl-none"
          onClick={() => setOpen((prevOpen) => setOpen(!prevOpen))}
        >
          <span className="material-icons-outlined text-primary font-size-3xl ">
            menu
          </span>
        </div>
        <div className="navbar-brand-wrapper">
          <a className="navbar-brand" href="/" aria-label="Identifee">
            <img
              className="navbar-brand-logo"
              style={{ height: '40px' }}
              src={`${
                tenant?.settings?.light_theme_logo ||
                // tenant?.logo ||
                '/img/logo-white.png'
              }`}
              alt={`${tenant.name} Logo`}
            />
            <img
              className="navbar-brand-logo-mini"
              src={`${
                tenant.settings?.light_theme_logo ||
                tenant.logo ||
                '/img/icon.svg'
              }`}
              alt={`${tenant.name} Logo`}
            />
          </a>
        </div>
        <div className="col pl-0">
          <Row>
            <Col>
              <Breadcrumb />
            </Col>
          </Row>
        </div>
        <div className="d-flex align-items-center col-auto pr-1">
          <HelpCenter />
          <div className="navbar-nav-wrap-content-right avatar-mobile">
            <ul className="navbar-nav align-items-center flex-row">
              <li className="nav-item">
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={toggle}
                  direction="down"
                >
                  <div className="hs-unfold">
                    <DropdownToggle
                      className="bg-transparent border-0 p-2"
                      data-toggle="dropdown"
                      aria-expanded={dropdownOpen}
                    >
                      <div>
                        <Avatar user={profile} active={false} />
                      </div>
                    </DropdownToggle>
                    <DropdownMenu className="navfix" right>
                      <div id="accountNavbarDropdown">
                        <Link to={`${routes.usersProfile}/${profile.id}`}>
                          <DropdownItem disabled>
                            <div className="media align-items-center">
                              <Avatar user={profile} classModifiers="mr-2" />
                              <div className="media-body">
                                <span className="card-title h5">
                                  {profile.id
                                    ? `${profile.first_name} ${profile.last_name}`
                                    : 'Loading...'}
                                </span>
                                <span className="card-text text-muted font-size-xs">
                                  {profile.email}
                                </span>
                              </div>
                            </div>
                          </DropdownItem>
                        </Link>
                        <div className="dropdown-divider"></div>
                        <Link to="/settings/profile">
                          <DropdownItem>
                            <span
                              className="text-truncate pr-2"
                              title="Settings"
                            >
                              {PROFILE_LABEL} Settings
                            </span>
                          </DropdownItem>
                        </Link>
                        <DropdownItem>
                          <div onClick={logout}>
                            <span
                              className="text-truncate pr-2"
                              title="Sign out"
                            >
                              {SIGN_OUT}
                            </span>
                          </div>
                        </DropdownItem>
                      </div>
                    </DropdownMenu>
                  </div>
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
