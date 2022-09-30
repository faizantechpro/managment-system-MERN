import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import getIconSrc from './IconSrc';

const BadgeIcon = ({
  name,
  badgeName,
  preview = false,
  bigIcon,
  className = '',
  tooltip,
}) => {
  return (
    <>
      {preview ? (
        <div className="preview">
          <img
            src={getIconSrc(badgeName)}
            alt="Badge icon"
            className="badge-create-icon"
          />
          <span className="preview-text uppercase">Preview</span>
        </div>
      ) : !tooltip ? (
        <img
          src={getIconSrc(badgeName)}
          alt="Badge icon"
          className={`${
            bigIcon ? 'badge-card-icon' : 'badge-list-icon'
          } ${className}`}
        />
      ) : (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-badge`}>{name}</Tooltip>}
        >
          <img
            src={getIconSrc(badgeName)}
            alt="Badge icon"
            className={`${
              bigIcon ? 'badge-card-icon' : 'badge-list-icon dfsdf'
            } ${className}`}
          />
        </OverlayTrigger>
      )}
    </>
  );
};

export default BadgeIcon;
