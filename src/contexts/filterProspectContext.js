import { useContext, createContext, useState } from 'react';

import { initialState } from '../components/prospecting/v2/constants';

export const FilterProspectContext = createContext({
  globalFilters: {},
  setGlobalFilters: () => null,
  globalFiltersCompany: {},
  setGlobalFiltersCompany: () => {},
});

export const FilterProspectProvider = (props) => {
  const [globalFilters, setGlobalFilters] = useState(initialState);
  const [globalFiltersCompany, setGlobalFiltersCompany] =
    useState(initialState);

  return (
    <FilterProspectContext.Provider
      value={{
        globalFilters,
        setGlobalFilters,
        globalFiltersCompany,
        setGlobalFiltersCompany,
      }}
    >
      {props.children}
    </FilterProspectContext.Provider>
  );
};

export const useFilterProspectContext = () => {
  return useContext(FilterProspectContext);
};
