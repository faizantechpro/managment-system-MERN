import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';

import InputSearch from './InputSearch';
import InputDefault from './InputDefault';
import { USACitiesByState } from '../../constants';
import { revenueListNew, employeeCountListNew } from '../constants';
import _ from 'lodash';
import CategoryMenuCompany from '../CategoryMenuCompany';

// converting city to city, state like pattern
const flattenCitiesList = _.flatten(
  _.values(
    _.mapValues(USACitiesByState, (cities, state) => {
      return cities.map((city) => `${city}, ${state}`);
    })
  )
);

const stepItems = {
  global: [
    {
      components: [
        {
          component: (
            <InputDefault
              name="Organization Name"
              keyType="global"
              keyFilter="name"
              placeholder="Enter organization name search..."
              showLabelColon={false}
            />
          ),
        },
      ],
      id: 11,
      icon: 'domain',
      titleWrapper: 'Organization Name',
      keyFilter: ['name'],
      titles: ['Organization Name'],
    },
  ],
  domain: [
    {
      components: [
        {
          component: (
            <InputDefault
              name="Domain"
              keyType="domain"
              keyFilter="domain"
              placeholder="Enter domain"
              showLabelColon={false}
            />
          ),
        },
      ],
      id: 12,
      icon: 'language',
      keyFilter: ['domain'],
      titles: ['Domain'],
    },
  ],
  location: [
    {
      components: [
        {
          component: (
            <InputSearch
              name="City, State"
              list={flattenCitiesList}
              limit={flattenCitiesList?.length}
              keyType="location"
              keyFilter="location"
              placeholder="Enter city, state search..."
              showLabelColon={false}
            />
          ),
        },
      ],
      id: 13,
      icon: 'pin_drop',
      keyFilter: ['location'],
      titles: ['Location'],
    },
  ],
  employer: [
    {
      components: [
        {
          component: (
            <InputSearch
              name="Employee Count"
              limit={9}
              keyType="employer"
              keyFilter="employees"
              customKey="key"
              list={employeeCountListNew}
              placeholder="Enter employee count search..."
              showLabelColon={false}
            />
          ),
        },
      ],
      id: 14,
      icon: 'group',
      titleWrapper: 'Employee Count',
      keyFilter: ['employees'],
      titles: ['Employee Count'],
    },
  ],
  revenue: [
    {
      components: [
        {
          component: (
            <InputSearch
              name="Revenue"
              limit={7}
              list={revenueListNew}
              customKey="key"
              keyType="revenue"
              keyFilter="revenue"
              placeholder="Enter revenue search..."
              showLabelColon={false}
            />
          ),
        },
      ],
      id: 15,
      icon: 'show_chart',
      titleWrapper: 'Revenue',
      keyFilter: ['revenue'],
      titles: ['Revenue'],
    },
  ],
  industry: [
    {
      components: [
        {
          component: (
            <InputDefault
              name="SIC Code"
              keyType="industry"
              keyFilter="sic_codes"
              placeholder="Enter a SIC code search..."
              showLabelColon={false}
            />
          ),
        },
        {
          component: (
            <InputDefault
              name="NAICS Code"
              keyType="industry"
              keyFilter="naics_codes"
              placeholder="Enter a NAICS code search..."
              showLabelColon={false}
            />
          ),
        },
      ],
      id: 16,
      titleWrapper: 'Industry',
      icon: 'area_chart',
      keyFilter: ['sic_codes', 'naics_codes'],
      titles: ['SIC Code', 'NAICS Code'],
    },
  ],
};

const FilterItemMenuCompany = ({
  title,
  data,
  setData,
  onEnter,
  active,
  setActive,
}) => {
  const [activeTap] = useState(true);

  return (
    <div className="w-100">
      <Collapse in={activeTap}>
        <div>
          {Array.isArray(stepItems[title]) ? (
            <CategoryMenuCompany
              stepItems={stepItems}
              title={title}
              data={data}
              setData={setData}
              onEnter={onEnter}
              active={active}
              setActive={setActive}
            />
          ) : (
            <></>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default FilterItemMenuCompany;
