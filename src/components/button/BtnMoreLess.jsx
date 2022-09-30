import React from 'react';

import './BtnMoreLess.css';
import { buttons } from '../../utils/constants';

const BtnMoreLess = ({ onClick, value = false }) => {
  return (
    <div className={'btn-more-less'}>
      <hr />
      <button className={'btn-white btn p-2'} onClick={onClick}>
        <span>
          <i className="material-icons-outlined">
            {value ? buttons.up : buttons.down}
          </i>
        </span>
        {value ? buttons.less : buttons.more}
        <span>
          <i className="material-icons-outlined">
            {value ? buttons.up : buttons.down}
          </i>
        </span>
      </button>
    </div>
  );
};

export default BtnMoreLess;
