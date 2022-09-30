import React from 'react';

import InsightsPanel from './InsightsPanel';
import ProspectLookup from './ProspectLookup';

const rightBarOptions = [
  {
    id: 'industryinsights',
    component: <InsightsPanel />,
  },
  {
    id: 'prospectLookup',
    component: <ProspectLookup />,
  },
];

const RightBar = ({ profileInfo, isPeople }) => {
  return (
    <div className="right-sidebar insights-bar border-left">
      <div className="splitted-content-mini splitted-content-mini-right splitted-content-bordered pb-3 pt-4 sticky-top z-index-2 w-auto">
        <ul className="nav nav-compact-icon list-unstyled-py-3 nav-compact-icon-circle justify-content-center">
          <li>
            {rightBarOptions.map((option) => {
              const { id, component } = option;
              if (isPeople && id === 'industryinsights') {
                return [];
              }

              return (
                <div key={id}>
                  {React.cloneElement(component, {
                    profileInfo,
                  })}
                </div>
              );
            })}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RightBar;
