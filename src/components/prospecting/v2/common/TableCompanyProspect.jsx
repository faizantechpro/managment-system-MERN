import React, { forwardRef, useState } from 'react';
import {
  Button,
  Card,
  FormControl,
  FormGroup,
  InputGroup,
} from 'react-bootstrap';

import Table from '../../../GenericTable';
import { columnsTableCompany } from '../../constants';
import MaterialIcon from '../../../commons/MaterialIcon';
import LookupPeopleLoader from '../../../loaders/LookupPeople';
import Skeleton from 'react-loading-skeleton';
import { useFilterProspectContext } from '../../../../contexts/filterProspectContext';
import TableSelectedCount from './TableSelectedCount';
import NoDataFound from '../../../commons/NoDataFound';
import RocketReachPeopleCard from '../../../organizationProfile/overview/RocketReachPeopleCard';
import RocketReactCompanyDetails from '../../../organizationProfile/overview/RocketReactCompanyDetails';
import ButtonIcon from '../../../commons/ButtonIcon';

const SearchButton = ({ onClick }) => (
  <InputGroup.Text
    role="button"
    onClick={onClick}
    className="position-absolute border-0 p-0 z-10"
    style={{ top: 13, left: 10 }}
  >
    <MaterialIcon icon="search" />
  </InputGroup.Text>
);

const Results = ({ pagination }) => {
  return (
    <span className="text-gray-900 fs-7">
      {' '}
      {pagination?.total?.toLocaleString()} Results
    </span>
  );
};

const SearchInput = forwardRef(
  ({ value, onChange, onClear, onSearch }, ref) => (
    <div className="p-3">
      <FormGroup className="position-relative" size="sm">
        <SearchButton onClick={onSearch} />
        <FormControl
          id="search-input"
          ref={ref}
          aria-label="Search"
          className={`form-control w-100 rounded px-5`}
          placeholder="Search"
          value={value}
          onChange={onChange}
          onKeyDown={onSearch}
        />
        {value && <ResetButton onClick={onClear} show={true} />}
      </FormGroup>
    </div>
  )
);

SearchInput.displayName = 'SearchInput';

const ResetButton = ({ onClick, show = true }) =>
  show && (
    <Button
      variant="link"
      className="border-0 pl-0 p-0 position-absolute"
      style={{ top: 13, right: 10 }}
      size="sm"
      onClick={onClick}
    >
      <span className="material-icons-outlined search-close">close</span>
    </Button>
  );

const CompanyColumn = ({ prospect }) => {
  return (
    <RocketReachPeopleCard
      prospect={{ ...prospect, full_name: prospect.name }}
      showSocialLinks
      withCompany={false}
      withLocation={false}
      avatarStyle={{ width: 50, height: 50 }}
      containerStyle={'pb-2'}
    />
  );
};

const LocationColumn = ({ prospect }) => {
  return (
    <>
      {prospect.city ? (
        <p className="prospect-typography-h6 text-wrap p-0 m-0">
          <span className="text-gray-900">
            {prospect.location ? (
              <span>{prospect.location}</span>
            ) : (
              <span>
                {prospect.city && <span>{prospect.city}</span>}
                {prospect.state && <span>, {prospect.state}</span>}{' '}
              </span>
            )}
          </span>
        </p>
      ) : (
        ''
      )}
    </>
  );
};

const CompanyInfoColumn = ({ prospect }) => {
  return (
    <p className="prospect-typography-h6 text-wrap p-0 m-0">
      <RocketReactCompanyDetails prospect={prospect} />
    </p>
  );
};

const TableCompanyProspect = ({
  data = [],
  checkbox = false,
  pagination,
  onPageChange,
  selectedProspects,
  setSelectedProspects,
  onHandleEdit,
  domain,
  selectAll,
  setSelectAll,
  onSearch,
  showLoading,
  chargeFilter,
  importProspects,
  clearSelection,
}) => {
  const [search, setSearch] = useState('');
  const { globalFiltersCompany, setGlobalFiltersCompany } =
    useFilterProspectContext();

  const updateProspects = (prospect) => {
    const newProspects = [...selectedProspects];
    newProspects.forEach((pros) => {
      if (pros.id === prospect.id) {
        pros.emails_list = prospect.emails_list;
        pros.phones_list = prospect.phones_list;
      }
    });
    setSelectedProspects(newProspects);
  };

  const rows = data.map((item) => {
    const response = {
      ...item,
      dataRow: [
        {
          key: 'Company',
          component: <CompanyColumn prospect={item} />,
        },
        {
          key: 'Location',
          component: <LocationColumn prospect={item} />,
        },
        {
          key: 'Details',
          component: (
            <CompanyInfoColumn
              prospect={item}
              setProspect={(item) => updateProspects(item)}
            />
          ),
        },
      ],
    };

    return response;
  });

  const componentAction = (
    <ButtonIcon
      icon="search"
      label="Employees"
      className="btn btn-success btn-xs text-white"
    />
  );

  const TablePlaceholder = () => {
    const Description = () => {
      return (
        <>
          Get started by putting a name, keyword, or for a more refined search,
          use the <MaterialIcon icon="filter_alt" /> filters to the left!
        </>
      );
    };
    const Title = () => {
      return (
        <div className="text-gray-search">Let&apos;s start searching!</div>
      );
    };
    return (
      <NoDataFound
        icon="manage_search"
        title={<Title />}
        description={<Description />}
        containerStyle={'text-gray-search py-6 my-6'}
      />
    );
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleSearchClear = () => {
    setSearch('');
    setGlobalFiltersCompany({
      ...globalFiltersCompany,
      global: { name: [''] },
    });
    chargeFilter({}, true);
  };

  return (
    <>
      <Card>
        <Card.Header className="border-bottom d-flex align-items-center justify-between">
          <h5 className="mb-0">Organizations</h5>
          {data && data.length > 0 && (
            <div>
              {domain && <span className="fw-bold">Contacts at {domain}</span>}
              {pagination?.total && <Results pagination={pagination} />}
            </div>
          )}
        </Card.Header>
        <Card.Body className="p-0">
          <SearchInput
            value={search}
            onSearch={onSearch}
            onChange={(e) => handleSearch(e)}
            onClear={handleSearchClear}
          />

          {showLoading && (
            <div className="px-3">
              <LookupPeopleLoader
                count={7}
                circle={<Skeleton height={60} width={60} circle />}
                container
              />
            </div>
          )}

          {selectedProspects.length > 0 && (
            <TableSelectedCount
              list={selectedProspects}
              containerPadding="p-3"
              btnClick={importProspects}
              btnClass="btn-sm text-white"
              btnIcon="add"
              btnLabel="Import Profiles"
              btnColor="success"
              onClear={clearSelection}
            />
          )}

          {!showLoading && rows.length > 0 ? (
            <Table
              className={`prospect-table`}
              checkbox={checkbox}
              selectedData={selectedProspects}
              setSelectedData={setSelectedProspects}
              columns={columnsTableCompany}
              data={rows}
              showLoading={showLoading}
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              paginationInfo={pagination}
              onPageChange={onPageChange}
              onHandleEdit={onHandleEdit}
              componentAction={componentAction}
              title="prospects"
              usePagination
              dataInDB={rows.length > 9}
              noDataInDbValidation
            />
          ) : (
            !showLoading && <TablePlaceholder />
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default TableCompanyProspect;
