import React from 'react';
import { LEADERBOARD_FILTER_TYPES } from '../../utils/constants';

const Filter = ({ updateFilter, currentFilter }) => {
  return (
    <div className="col-sm-auto">
      <ul className="nav nav-segment font-weight-medium">
        {LEADERBOARD_FILTER_TYPES.map((filterType) => {
          return (
            <li key={filterType.key} className="nav-item">
              <a
                className={`nav-link ${
                  filterType.key === currentFilter ? 'active' : ''
                }`}
                href="#!"
                onClick={() => {
                  updateFilter(filterType.key);
                }}
              >
                {filterType.description}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Filter;
