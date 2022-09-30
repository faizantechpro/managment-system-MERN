import { useRef, useState } from 'react';
import useOutsideClick from '../hooks/useOutsideClick';

import { FILTER_APPLY, FILTER_LABEL } from '../utils/constants';
import FilterSelect from './FilterSelect';

export default function Filters({
  onHandleFilterContact,
  dispatch,
  filtersItems,
  filterTitle,
  callbackService,
  callbackRequest,
  callbackResponseData,
  customTitle,
  searchPlaceholder,
  variant,
  customKey,
  showSelectOnly = false,
  showAvatar = true,
  showSelected,
}) {
  const filterDropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useOutsideClick(filterDropdownRef, setDropdownOpen);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const toogleClassName = dropdownOpen ? '' : 'hs-unfold-hidden';

  const onHandleApplyFilters = (item) => {
    onHandleFilterContact(item);
    toggle();
  };

  return (
    <>
      {!showSelectOnly && (
        <div className="hs-unfold" ref={filterDropdownRef}>
          <div
            className={`js-hs-unfold-invoker btn btn-sm btn-white dropdown-toggle ${
              showSelected && !showSelected.includes('All')
                ? 'btn-soft-primary'
                : ''
            }`}
            data-uw-styling-context="true"
            onClick={toggle}
          >
            <i
              className="material-icons-outlined mr-1"
              data-uw-styling-context="true"
            >
              filter_list
            </i>
            {showSelected || FILTER_LABEL}
          </div>
          <div
            id="usersFilterDropdown"
            className={`hs-unfold-content dropdown-unfold dropdown-menu dropdown-menu-sm-right dropdown-card card-dropdown-filter-centered hs-unfold-content-initialized ${toogleClassName} animated animation-duration-3 min-width-22`}
            data-hs-target-height="200"
          >
            <div className="card">
              {filterTitle && (
                <div className="card-header">
                  <h5
                    className="card-header-title"
                    data-uw-styling-context="true"
                  >
                    {filterTitle}
                  </h5>
                </div>
              )}
              <div className="card-body">
                <form>
                  <div className="form-row">
                    <div className={`col-12 form-group ${variant && 'mb-0'}`}>
                      {filtersItems?.map((filterItem) => (
                        <FilterSelect
                          key={filterItem.id}
                          filterItem={filterItem}
                          options={filterItem.options}
                          dispatch={dispatch}
                          callbackService={callbackService}
                          callbackRequest={callbackRequest}
                          callbackResponseData={callbackResponseData}
                          customTitle={customTitle}
                          searchPlaceholder={searchPlaceholder}
                          customKey={customKey}
                          showAvatar={showAvatar}
                        />
                      ))}
                    </div>
                  </div>
                  <div
                    className="js-hs-unfold-invoker btn btn-block btn-primary"
                    onClick={onHandleApplyFilters}
                  >
                    {FILTER_APPLY}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSelectOnly && (
        <div ref={filterDropdownRef}>
          <form>
            <div className="form-row">
              <div className={`col-12 form-group ${variant && 'mb-0'}`}>
                {filtersItems?.map((filterItem) => (
                  <FilterSelect
                    key={filterItem.id}
                    filterItem={filterItem}
                    options={filterItem.options}
                    dispatch={dispatch}
                    callbackService={callbackService}
                    callbackRequest={callbackRequest}
                    callbackResponseData={callbackResponseData}
                    customTitle={customTitle}
                    searchPlaceholder={searchPlaceholder}
                    customKey={customKey}
                    onItemSelect={onHandleApplyFilters}
                    showAvatar={showAvatar}
                  />
                ))}
              </div>
            </div>
            <div
              className="js-hs-unfold-invoker btn btn-block btn-primary"
              onClick={onHandleApplyFilters}
            >
              {FILTER_APPLY}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
