import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const TooltipComponent = ({ title, placement = 'bottom', children }) => {
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip className="font-weight-semi-bold">{title}</Tooltip>}
    >
      {children}
    </OverlayTrigger>
  );
};

export default TooltipComponent;
