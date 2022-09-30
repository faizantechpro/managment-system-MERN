import ByCodeFilter from './ByCodeFilter';
import BySearch from '../BySearch';
import ByIndustryCategory from './ByCategory';
import { industries } from '../../constants';

export const industry = [
  {
    name: 'By Industry Category',
    component: <ByIndustryCategory />,
  },
  {
    name: 'Search by Industry Name',
    component: (
      <BySearch
        label="industry"
        itemsFilter={industries}
        keyType="industry"
        keyFilter="industries"
        typeCheck
      />
    ),
  },
  {
    name: 'SIC Code',
    component: (
      <ByCodeFilter
        keyFilter="sic_codes"
        message="Enter 2, 4 or 6 digit SIC Codes Below"
      />
    ),
  },
  {
    name: 'NAICS Code',
    component: (
      <ByCodeFilter
        keyFilter="naics_codes"
        message="Enter NAICS codes below (2, 3, 4, 5 or 6 digit codes are accepted)"
      />
    ),
  },
];
