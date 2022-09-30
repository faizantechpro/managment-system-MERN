import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const IdfTooltip = ({ placement, text, children }) => {
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip className="font-weight-semi-bold">{text}</Tooltip>}
    >
      <span>{children}</span>
    </OverlayTrigger>
  );
};

IdfTooltip.defaultProps = {
  placement: 'top',
  text: '',
  children: null,
};

export default IdfTooltip;
