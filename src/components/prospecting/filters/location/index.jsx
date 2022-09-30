import BySearch from '../BySearch';

import { stateList, cityList } from '../../constants';

export const location = [
  {
    name: 'By State',
    component: (
      <BySearch
        label="state"
        itemsFilter={stateList}
        keyType="location"
        keyFilter="states"
      />
    ),
  },
  {
    name: 'By city',
    component: (
      <BySearch
        label="city"
        itemsFilter={cityList}
        keyType="location"
        keyFilter="cities"
      />
    ),
  },
];
