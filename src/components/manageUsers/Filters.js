import { useEffect, useRef, useState } from 'react';

import useOutsideClick from '../../hooks/useOutsideClick';
import {
  FILTER_APPLY,
  FILTER_CARD_TITLE,
  FILTER_LABEL,
  FILTER_ROLE,
  FILTER_STATUS,
} from '../../utils/constants';
import { options } from './ManageUsers.constants';
import SearchFilter from './SearchFilter';
import IdfSelectRole from '../idfComponents/idfDropdown/IdfSelectRole';

export default function Filters({ onHandleFilterUsers }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectTitle, setSelectTitle] = useState('All');
  const [searchRole, setSearchRole] = useState({});
  const [roleSelection, setRoleSelection] = useState({});
  const dropdownRef = useRef(null);

  const SearchDrop = useRef(null);

  useOutsideClick(SearchDrop, setSearchOpen);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const toogleSearch = () => setSearchOpen((prevState) => !prevState);

  const toogleClassName = dropdownOpen ? '' : 'hs-unfold-hidden';
  const toogleSearchClassName = searchOpen ? '' : 'hs-unfold-hidden';

  const onHandleSelect = (item) => {
    const seletedItemTitle = options?.find((option) => option.id === item.id);

    setSelectTitle(seletedItemTitle.title);
  };

  const onHandleApplyFilters = () => {
    onHandleFilterUsers({
      filterUsers: selectTitle.toLocaleLowerCase(),
      roleId: roleSelection.id,
    });
    toggle();
  };

  const onInputSearch = (e) => {
    const { value } = e.target || {};

    setSearchRole({
      ...searchRole,
      search: value?.name,
    });

    setRoleSelection(value);
  };
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="hs-unfold" ref={dropdownRef}>
      <div
        className="js-hs-unfold-invoker btn btn-sm btn-white dropdown-toggle"
        data-uw-styling-context="true"
        onClick={toggle}
      >
        <i
          className="material-icons-outlined mr-1"
          data-uw-styling-context="true"
        >
          filter_list
        </i>
        {FILTER_LABEL}s
      </div>
      <div
        id="usersFilterDropdown"
        className={`hs-unfold-content dropdown-unfold dropdown-menu dropdown-menu-sm-right dropdown-card card-dropdown-filter-centered hs-unfold-content-initialized ${toogleClassName} animated animation-duration-3 min-width-22`}
        data-hs-target-height="200"
      >
        <div className="card">
          <div className="card-header">
            <h5 className="card-header-title" data-uw-styling-context="true">
              {FILTER_CARD_TITLE}
            </h5>
          </div>
          <div className="card-body">
            <form>
              <div className="form-row">
                <div className="col-12 form-group">
                  <small
                    className="text-cap mb-2"
                    data-uw-styling-context="true"
                  >
                    {FILTER_STATUS}
                  </small>

                  <span
                    className="select2 select2-container select2-container--default width-full"
                    dir="ltr"
                    data-select2-id="2"
                    onClick={toogleSearch}
                    ref={SearchDrop}
                  >
                    <span className="selection">
                      <span
                        className="select2-selection custom-select"
                        tabIndex="0"
                      >
                        <span
                          className="select2-selection__rendered"
                          id="select2-9xhz-container"
                          title="All"
                        >
                          <span data-uw-styling-context="true">
                            {selectTitle}
                          </span>
                        </span>
                        <span className="select2-selection__arrow">
                          <b role="presentation"></b>
                        </span>
                      </span>
                    </span>
                    <span
                      className="dropdown-wrapper"
                      aria-hidden="true"
                    ></span>
                  </span>

                  <SearchFilter
                    toogleSearch={toogleSearch}
                    toogleSearchClassName={toogleSearchClassName}
                    options={options}
                    filterSelected={selectTitle.toLocaleLowerCase()}
                    onHandleSelect={onHandleSelect}
                  />
                </div>
              </div>

              <div className={`text-cap small mb-2`}>{FILTER_ROLE}</div>

              <IdfSelectRole
                id="selectRoleDropdown"
                onChange={onInputSearch}
                value={searchRole}
                showAll
              />
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
  );
}
