import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import {
  CircularProgressbar,
  buildStyles,
  CircularProgressbarWithChildren,
} from 'react-circular-progressbar';

export const ProgressBarDefault = ({ now = 0, variant }) => {
  return (
    <div className="w-100 d-flex justify-content-centern align-items-center text-primary fw-bold">
      <ProgressBar now={now} className="w-75 mx-2" variant={variant} />
      <span
        className={variant ? 'color-font-progress-success' : 'text-primary'}
      >
        {now}%
      </span>
    </div>
  );
};

export const ProgressCircleDefault = ({
  now,
  label = false,
  classnames,
  simple,
}) => {
  return (
    <div className={`size-progress-circle ${classnames}`}>
      {now !== 100 && (
        <CircularProgressbar
          value={now}
          text={label && `${now}%`}
          styles={buildStyles({
            textColor: 'red',
            pathColor: 'var(--secondaryColor)',
            trailColor: 'lightgray',
          })}
          strokeWidth={10}
        />
      )}
      {now === 100 && !simple && (
        <CircularProgressbarWithChildren
          value={now}
          strokeWidth={50}
          styles={buildStyles({
            pathColor: 'var(--secondaryColor)',
            strokeLinecap: 'butt',
          })}
        >
          <span className="material-icons-outlined text-white">done</span>
        </CircularProgressbarWithChildren>
      )}
    </div>
  );
};
