import React, { useEffect, useReducer, useState } from 'react';
import { Nav } from 'react-bootstrap';

import './style.css';
import {
  orgFilters,
  initialStateCompany,
  reducer,
  ProspectTypes,
} from './constants';
import ButtonIcon from '../../commons/ButtonIcon';
import { useFilterProspectContext } from '../../../contexts/filterProspectContext';
import FilterItemMenuCompany from './common/FilterItemMenuCompany';
import prospectService from '../../../services/prospect.service';
import { getKeysWithData } from '../../../utils/Utils';
import _ from 'lodash';

import { useLocation } from 'react-router';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
const MenuCompany = ({ chargeFilter, saveFilter, loadFilter }) => {
  const query = useQuery();
  const flag = query.get('back');
  const { globalFiltersCompany, setGlobalFiltersCompany } =
    useFilterProspectContext();
  const [data, dispatch] = useReducer(reducer, initialStateCompany);
  const [showClear, setShowClear] = useState(false);
  const [active, setActive] = useState(null);
  const [firstRender, setFirstRender] = useState(false);

  const onSubmit = async () => {
    const filters = getKeysWithData(data);
    if (Object.keys(filters).length) {
      setShowClear(true);
      chargeFilter(filters);
      setGlobalFiltersCompany(data);
    } else {
      chargeFilter({}, 'LOAD');
      setShowClear(false);
      dispatch({ type: 'set', payload: initialStateCompany });
    }
  };

  const clearFilter = () => {
    setShowClear(false);
    dispatch({ type: 'set', payload: initialStateCompany });
    chargeFilter({}, 'CLEAR');
    setGlobalFiltersCompany(initialStateCompany);
    prospectService.saveFilterSearch(ProspectTypes.company, null);
    setActive(null);
  };

  const onEnter = () => {
    if (firstRender || showClear) {
      onSubmit();
    } else {
      setFirstRender(true);
    }

    if (firstRender) setFirstRender(false);
  };

  useEffect(() => {
    if (flag === 'true') {
      dispatch({ type: 'set', payload: globalFiltersCompany });
    } else {
      setGlobalFiltersCompany(initialStateCompany);
    }
  }, []);

  useEffect(() => {
    setGlobalFiltersCompany(data);
  }, [data]);

  useEffect(() => {
    // if we get load filter from parent component then dispatch updated filters list to show in filter menu
    dispatch({ type: 'set', payload: globalFiltersCompany });
    const filters = getKeysWithData(globalFiltersCompany);
    setShowClear(!_.isEmpty(filters));
  }, [loadFilter]);

  return (
    <div>
      <Nav className="flex-column">
        {orgFilters.map((name) => (
          <Nav.Link as="div" key={name} className={`p-0`}>
            <FilterItemMenuCompany
              title={name}
              data={data}
              setData={dispatch}
              onEnter={onEnter}
              active={active}
              setActive={setActive}
            />
          </Nav.Link>
        ))}
      </Nav>

      {showClear && (
        <>
          <div className="w-100 d-flex mt-3">
            <ButtonIcon
              label="Clear All"
              classnames="btn-sm mx-3 fw-bold btn-block"
              color="outline-danger"
              onclick={clearFilter}
            />
          </div>
          <div className="w-100 d-flex my-2">
            <ButtonIcon
              label="Save Filter"
              classnames="btn-sm mx-3 fw-bold btn-block"
              color="primary"
              onclick={saveFilter}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MenuCompany;
