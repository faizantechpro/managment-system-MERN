import React from 'react';
import { Nav } from 'react-bootstrap';

import { filterItems, initialFilters } from './constants';
import SearchGlobalProspects from './filters/SearchGlobalProspects';
import SubmenuDropdown from './filters/SubmenuDropdown';

const FilterMenu = ({ data, setData, onHandleDone }) => {
  const validateEmptyItem = (item) => {
    const value = item.toLowerCase();
    let result = false;

    switch (value) {
      case 'industry': {
        const { industries, sic_codes, naics_codes, category } = data[value];
        Object.entries(category).forEach(([, item]) => {
          if (item.length > 0) {
            result = true;
          }
        });

        if (result) break;

        [industries, sic_codes, naics_codes].forEach((row) => {
          if (row.length > 0) {
            result = true;
          }
        });

        break;
      }

      case 'title': {
        const { titles, job_functions, management_levels } = data[value];

        if (titles.trim() !== '') {
          result = true;
          break;
        }

        [job_functions, management_levels].forEach((row) => {
          if (row.length > 0) {
            result = true;
          }
        });

        break;
      }

      case 'location': {
        const { cities, states } = data[value];
        [cities, states].forEach((row) => {
          if (row.length > 0) {
            result = true;
          }
        });

        break;
      }

      case 'revenue':
      case 'employees': {
        const { range } = data[value];

        if (range.length > 0) {
          result = true;
        }

        break;
      }
    }

    return result;
  };

  const clearItem = (item) => {
    const value = item.toLowerCase();

    const newData = {
      ...data,
      [value]: initialFilters[value],
    };

    setData(newData);
  };

  return (
    <Nav className="flex-column font-weight-semi-bold">
      <SearchGlobalProspects
        data={data}
        setData={setData}
        onHandleDone={onHandleDone}
      />

      {filterItems?.map((filter, index) => {
        const { name, icon, subName } = filter;

        return (
          <Nav.Link
            as="div"
            key={index}
            className={`d-flex flex-row align-items-center text-muted cursor-pointer`}
          >
            <SubmenuDropdown
              onHandleDone={onHandleDone}
              title={name}
              validate={validateEmptyItem}
              subName={subName}
              icon={icon}
              data={data}
              setData={setData}
              onClear={clearItem}
            />
          </Nav.Link>
        );
      })}
    </Nav>
  );
};

export default FilterMenu;
