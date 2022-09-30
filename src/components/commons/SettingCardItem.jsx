import { Link } from 'react-router-dom';
import React from 'react';
import MaterialIcon from './MaterialIcon';
import ButtonIcon from './ButtonIcon';
import TooltipComponent from '../lesson/Tooltip';

const IconAndTitle = ({ item }) => {
  return (
    <>
      <MaterialIcon
        icon={item.icon}
        clazz="material-icons-outlined text-primary font-size-4xl"
      />
      <span className="font-size-md text-black font-weight-medium mt-2">
        {item.title}
      </span>
    </>
  );
};

const LogoAndButton = ({ item, onClick }) => {
  const defaultLogoDimensions = { height: 60, width: 150, ...item.logoStyle };
  return (
    <TooltipComponent placement="top" title={item.title}>
      <a className="z-index-10 cursor-default">
        <div className="mb-2 m-auto">
          <img
            src={item.logo}
            style={{ objectFit: 'contain', ...defaultLogoDimensions }}
            alt={item.title}
          />
        </div>
        <ButtonIcon
          onclick={onClick}
          classnames={`mt-2 cursor-default w-auto btn-sm px-3 ${
            item.isDisabled ? 'disabled' : ''
          }`}
          color={item.isActive ? 'success' : 'white'}
          label={item.isActive ? 'Active' : 'Setup'}
        />
      </a>
    </TooltipComponent>
  );
};

// for handling both icons/images, by default icons, for ref: see Settings.js/Integration.jsx
const SettingCardItem = ({ item, url, iconOrLogo = true, onClick }) => {
  return (
    <div className={`card setting-item border-2 position-relative h-100`}>
      <Link
        to={url}
        className={`card-body text-center p-4 ${
          !iconOrLogo ? 'cursor-default' : ''
        }`}
      >
        <div className="stretched-link justify-content-center align-items-center d-flex flex-column">
          {iconOrLogo ? (
            <IconAndTitle item={item} />
          ) : (
            <LogoAndButton item={item} onClick={onClick} />
          )}
        </div>
      </Link>
    </div>
  );
};

export default SettingCardItem;
