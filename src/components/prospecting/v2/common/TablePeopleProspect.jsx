import React, { forwardRef, useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  FormControl,
  FormGroup,
  InputGroup,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap';

import Table from '../../../GenericTable';
import { columnsTablePeople } from '../../constants';
import constantsString from '../../../../utils/stringConstants.json';
import MaterialIcon from '../../../commons/MaterialIcon';
import RocketReachPeopleCard from '../../../organizationProfile/overview/RocketReachPeopleCard';
import RocketReachViewInfoCard from '../../../organizationProfile/overview/RocketReachViewInfoCard';
import LookupPeopleLoader from '../../../loaders/LookupPeople';
import Skeleton from 'react-loading-skeleton';
import { useFilterProspectContext } from '../../../../contexts/filterProspectContext';
import TableSelectedCount from './TableSelectedCount';
import NoDataFound from '../../../commons/NoDataFound';
import TooltipComponent from '../../../lesson/Tooltip';
import { Col, PopoverBody, Row, Spinner } from 'reactstrap';
import prospectService from '../../../../services/prospect.service';
import { roundNumbers } from '../../../../utils/Utils';
import { TenantContext } from '../../../../contexts/TenantContext';
import ButtonIcon from '../../../commons/ButtonIcon';
import {
  checkPermission,
  PermissionsConstants,
} from '../../../../utils/permissions.constants';

const constants = constantsString.deals.prospecting;

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

const NameColumn = ({ prospect }) => {
  return (
    <RocketReachPeopleCard
      prospect={prospect}
      showSocialLinks
      withCompany={false}
      withLocation={false}
      avatarStyle={{ width: 50, height: 50 }}
    />
  );
};

const RocketReachCompanyProfile = ({ prospect, children }) => {
  // load company details when hover on, so...
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState({});
  const [isOpened, setIsOpened] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const addressify = (comp) => {
    const address = [comp.address, comp.city].filter((a) => !!a).join(', ');
    return `${address} ${comp.state} ${comp.country}`;
  };

  const loadCompany = async () => {
    setIsLoading(true);
    const { data } = await prospectService.getCompany({
      name: prospect.employer || prospect.current_employer,
    });
    setIsLoading(false);
    if (data.error) {
      setCompany({});
      setNoDataFound(true);
    } else {
      setCompany(data);
    }
  };

  useEffect(() => {
    isOpened && loadCompany();
  }, [isOpened]);

  const OrgItemRow = ({ children }) => {
    return <Row className="my-1">{children}</Row>;
  };

  const Title = () => {
    return <h5 className="mb-0">No company details found.</h5>;
  };

  // TODO: this overlay trigger needs to be a generic component, will make it.
  return (
    <>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        show={isOpened}
        placement="bottom"
        onToggle={setIsOpened}
        overlay={
          isLoading ? (
            <Popover>
              <PopoverBody className="py-2 px-3">
                <Spinner className="text-primary spinner-grow-xs" />
              </PopoverBody>
            </Popover>
          ) : (
            <Popover style={{ minWidth: 300 }}>
              <PopoverBody className={noDataFound ? 'py-2 px-0' : ''}>
                <>
                  {noDataFound ? (
                    <NoDataFound
                      title={<Title />}
                      icon="search"
                      iconStyle="font-size-2em"
                      containerStyle="w-100 text-gray-900 py-0 my-0"
                    />
                  ) : (
                    <>
                      <Row className="mb-2">
                        <Col>
                          <div className="d-flex align-items-center">
                            <span
                              style={{ width: 40, height: 40 }}
                              className="avatar-initials avatar-icon-font-size p-2 mr-2 rounded-circle border-primary text-primary"
                            >
                              <MaterialIcon icon="business" clazz="fs-6" />
                            </span>
                            <h5>{company.name}</h5>
                          </div>
                        </Col>
                      </Row>
                      {company.domain && (
                        <OrgItemRow>
                          <Col md={4}>
                            <p className="mb-0 fs-8 font-weight-semi-bold">
                              Website
                            </p>
                          </Col>
                          <Col md={8}>
                            <p className="mb-0 fs-8">{company.domain}</p>
                          </Col>
                        </OrgItemRow>
                      )}
                      {company.revenue && (
                        <OrgItemRow>
                          <Col md={4}>
                            <p className="mb-0 fs-8 font-weight-semi-bold">
                              Revenue
                            </p>
                          </Col>
                          <Col md={8}>
                            <p className="mb-0 fs-8 text-capitalize">
                              ${roundNumbers(company.revenue, 'long', 2)}
                            </p>
                          </Col>
                        </OrgItemRow>
                      )}
                      {company.employees && (
                        <OrgItemRow>
                          <Col md={4}>
                            <p className="mb-0 fs-8 font-weight-semi-bold">
                              Employees
                            </p>
                          </Col>
                          <Col md={8}>
                            <p className="mb-0 fs-8 text-capitalize">
                              {company.employees}
                            </p>
                          </Col>
                        </OrgItemRow>
                      )}
                      {(company.founded || company.year_founded) && (
                        <OrgItemRow>
                          <Col md={4}>
                            <p className="mb-0 fs-8 font-weight-semi-bold">
                              Founded
                            </p>
                          </Col>
                          <Col md={8}>
                            <p className="mb-0 fs-8 text-capitalize">
                              {company.founded || company.year_founded}
                            </p>
                          </Col>
                        </OrgItemRow>
                      )}
                      <OrgItemRow>
                        <Col md={4}>
                          <p className="mb-0 fs-8 font-weight-semi-bold">
                            Address
                          </p>
                        </Col>
                        <Col md={8}>
                          <p className="mb-0 fs-8 text-capitalize">
                            {addressify(company)}
                          </p>
                        </Col>
                      </OrgItemRow>
                      {company.phone && (
                        <OrgItemRow>
                          <Col md={4}>
                            <p className="mb-0 fs-8 font-weight-semi-bold">
                              Phone
                            </p>
                          </Col>
                          <Col md={8}>
                            <p className="mb-0 fs-8 text-capitalize">
                              {company.phone}
                            </p>
                          </Col>
                        </OrgItemRow>
                      )}
                      {company.industry && (
                        <OrgItemRow>
                          <Col md={4}>
                            <p className="mb-0 fs-8 font-weight-semi-bold">
                              Category
                            </p>
                          </Col>
                          <Col md={8}>
                            <p className="mb-0 fs-8 text-capitalize">
                              {company.industry}
                            </p>
                          </Col>
                        </OrgItemRow>
                      )}
                      {company.sic && (
                        <OrgItemRow>
                          <Col md={4}>
                            <p className="mb-0 fs-8 font-weight-semi-bold">
                              Sic
                            </p>
                          </Col>
                          <Col md={8}>
                            <p className="mb-0 fs-8 text-capitalize">
                              {company.sic}
                            </p>
                          </Col>
                        </OrgItemRow>
                      )}
                    </>
                  )}
                </>
              </PopoverBody>
            </Popover>
          )
        }
      >
        {children}
      </OverlayTrigger>
    </>
  );
};

const CompanyColumn = ({ prospect }) => {
  return (
    <>
      {prospect.employer && prospect.employer.toLowerCase() !== 'undefined' ? (
        <RocketReachCompanyProfile prospect={prospect}>
          <a className="prospect-typography-h6 cursor-pointer hoverLink p-0 m-0">
            <span className="hoverLink text-wrap">{prospect.employer}</span>
          </a>
        </RocketReachCompanyProfile>
      ) : (
        ''
      )}
    </>
  );
};

const LocationColumn = ({ prospect }) => {
  return (
    <>
      {prospect.location ? (
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

const ContactInfoColumn = ({ prospect, setProspect }) => {
  return (
    <RocketReachViewInfoCard
      prospect={prospect}
      setProspect={setProspect}
      layout="column"
    />
  );
};

const TablePeopleProspect = ({
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
  exportProspects,
  clearSelection,
}) => {
  const [search, setSearch] = useState('');
  const { tenant } = useContext(TenantContext);
  const { globalFilters, setGlobalFilters } = useFilterProspectContext();
  const [permissionExportImport, setPermissionExportImport] = useState({
    export: true,
    import: true,
  });

  const checkForImportExport = () => {
    const { modules } = tenant;
    if (!modules || modules === '*') {
      setPermissionExportImport({
        export: true,
        import: true,
      });
    } else {
      const isAllowedImport =
        checkPermission(tenant.modules, [PermissionsConstants.Resources.import])
          .length > 0;
      const isAllowedExport =
        checkPermission(tenant.modules, [PermissionsConstants.Resources.export])
          .length > 0;
      setPermissionExportImport({
        import: isAllowedImport,
        export: isAllowedExport,
      });
    }
  };

  useEffect(() => {
    checkForImportExport();
  }, []);

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
          key: 'Name',
          component: <NameColumn prospect={item} />,
        },
        {
          key: 'Company',
          component: <CompanyColumn prospect={item} />,
        },
        {
          key: 'Location',
          component: <LocationColumn prospect={item} />,
        },
        {
          key: 'Available Details',
          component: (
            <ContactInfoColumn
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
    <TooltipComponent
      title={`${
        permissionExportImport.import
          ? constants.importLabel + ' Profile'
          : 'Imports Disabled.'
      }`}
    >
      <button
        type="button"
        disabled={!permissionExportImport.import}
        className="btn d-flex align-items-center justify-content-center btn-success btn-xs text-white"
      >
        {' '}
        <MaterialIcon icon="add" />{' '}
      </button>
    </TooltipComponent>
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
    setGlobalFilters({ ...globalFilters, global: { name: [''] } });
    chargeFilter({}, true);
  };

  const handleOnEdit = (row) => {
    if (!permissionExportImport.import) {
      return;
    }

    onHandleEdit(row);
  };

  return (
    <>
      <Card>
        <Card.Header className="border-bottom d-flex align-items-center justify-between">
          <h5 className="mb-0">People</h5>
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
              customButton={
                <>
                  <ButtonIcon
                    onclick={importProspects}
                    icon="add"
                    disabled={!permissionExportImport.import}
                    label="Import Profiles"
                    classnames={`btn-sm text-white ${
                      permissionExportImport.import
                        ? ''
                        : 'd-flex align-items-center justify-content-center'
                    }`}
                    color="success"
                    tooltip={
                      !permissionExportImport.import ? 'Imports Disabled' : ''
                    }
                  />
                  {permissionExportImport.export && (
                    <ButtonIcon
                      onclick={exportProspects}
                      icon="file_download"
                      disabled={!permissionExportImport.export}
                      label="Export Profiles"
                      classnames="btn-sm ml-2"
                      color="outline-primary"
                    />
                  )}
                </>
              }
            />
          )}

          {!showLoading && rows.length > 0 ? (
            <Table
              className={`prospect-table`}
              checkbox={checkbox}
              selectedData={selectedProspects}
              setSelectedData={setSelectedProspects}
              columns={columnsTablePeople}
              data={rows}
              showLoading={showLoading}
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              paginationInfo={pagination}
              onPageChange={onPageChange}
              onHandleEdit={handleOnEdit}
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

export default TablePeopleProspect;
