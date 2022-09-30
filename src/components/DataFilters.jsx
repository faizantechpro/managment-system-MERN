import Search from './manageUsers/Search';
import Selected from './manageUsers/Selected';
import { isToFixedNoRound } from '../utils/Utils';
import { paginationDefault, DEALS_LABEL } from '../utils/constants';

export const DataFilters = ({
  filterSelected,
  setFilterSelected,
  usersSelected,
  onHandleDelete,
  searchPlaceholder,
  children,
  variant,
  infoDeals,
  paginationPage,
  setPaginationPage,
  showSearch = true,
}) => {
  const onHandleChange = (e) => {
    if (paginationPage.page !== 1) {
      setPaginationPage(paginationDefault);
    }

    const newFilterSelected = {
      ...filterSelected,
      search: e.target.value,
    };

    const hasFilters = Object.keys(newFilterSelected.search);

    if (!hasFilters.length) {
      delete newFilterSelected.search;
    }

    setFilterSelected(newFilterSelected);
  };

  return (
    <div className="row justify-content-between text-gray-900 align-items-center flex-grow-1">
      {showSearch && (
        <Search
          onHandleChange={onHandleChange}
          searchPlaceholder={searchPlaceholder}
          variant={variant}
        />
      )}

      <div>
        <div className="d-sm-flex justify-content-sm-end align-items-sm-center">
          {variant && (
            <span className="mr-4">
              {isToFixedNoRound(infoDeals?.total || 0)} •{' '}
              {infoDeals?.count_deals} {DEALS_LABEL.toLowerCase()}
            </span>
          )}
          <Selected usersSelected={usersSelected} onDelete={onHandleDelete} />
          {children}
        </div>
      </div>
    </div>
  );
};
