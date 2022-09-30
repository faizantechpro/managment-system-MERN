import React from 'react';
import Filter from './Filter';

export default function Heading({ title, useBc, updateFilter, currentFilter }) {
  return (
    <div className="page-header">
      <div className="row align-items-end">
        <div className="col-sm mb-2 mb-sm-0">
          <h1 className="page-header-title">{title}</h1>
        </div>
        <Filter updateFilter={updateFilter} currentFilter={currentFilter} />
      </div>
    </div>
  );
}
