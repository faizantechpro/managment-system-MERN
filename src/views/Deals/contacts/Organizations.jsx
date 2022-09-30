import React, { useState, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import { Card, Dropdown, Tab, Tabs } from 'react-bootstrap';

import Filters from '../../../components/Filters';
import Table from '../../../components/GenericTable';
import {
  initialFilters,
  initialFiltersItems,
  initialOrgForm,
  organizationColumns,
} from './Contacts.constants';
import organizationService from '../../../services/organization.service';
import {
  ADD_ORGANIZATION,
  EMPTY_ORG_NAME,
  FILTER_ORGANIZATION,
  OWNER,
  paginationDefault,
  ORGANIZATION_CREATED,
  SEARCH_FOR_USER,
} from '../../../utils/constants';
import SimpleModalCreation from '../../../components/modal/SimpleModalCreation';
import OrganizationForm from '../../../components/organizations/OrganizationForm';
import { changePaginationPage, onHandleCloseModal, reducer } from './utils';
import userService from '../../../services/user.service';
import Alert from '../../../components/Alert/Alert';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import Loading from '../../../components/Loading';
import routes from '../../../utils/routes.json';
import { organizationFormFields } from '../../../components/organizations/organizationFormsFields';
import DeleteModal from '../../../components/modal/DeleteModal';

import stringConstants from '../../../utils/stringConstants.json';
import LayoutHead from '../../../components/commons/LayoutHead';
import { sortingTable } from '../../../utils/sortingTable';
import { splitAddress } from '../../../utils/Utils';
import MaterialIcon from '../../../components/commons/MaterialIcon';

const organizationConstants = stringConstants.deals.organizations;

const Organizations = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [modal, setModal] = useState(false);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [filterSelected, setFilterSelected] = useState({});
  const [filtersItems, setFiltersItems] = useState(initialFiltersItems);
  const [filterRefresh, setFilterRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [pagination, setPagination] = useState(paginationDefault);
  const [paginationPage, setPaginationPage] = useState(paginationDefault);
  const [order, setOrder] = useState([]);

  const [filters, dispatch] = useReducer(reducer, initialFilters);
  const [orgFormData, dispatchFormData] = useReducer(reducer, initialOrgForm);

  const [modified, setModified] = useState(false);
  const [showDeleteOrgModal, setShowDeleteOrgModal] = useState(false);
  const [deleteResults, setDeleteResults] = useState([]);
  const [showDeleteReport, setShowDeleteReport] = useState(false);
  const [dataInDB, setDataInDB] = useState(false);
  const [me, setMe] = useState(null);
  const [preOwners, setPreOwners] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterTabs, setFilterTabs] = useState('filters');
  const [filterOptionSelected, setFilterOptionSelected] = useState({
    id: 3,
    key: 'AllOrganizations',
    name: 'All Organizations',
  });

  const OrganizationFilterTabs = () => {
    const ORGANIZATION_FILTER_OPTIONS_LIST = [
      { id: 1, key: 'RecentlyViewed', name: 'Recently Viewed' },
      { id: 2, key: 'MyOrganization', name: 'My Organizations' },
      { id: 3, key: 'AllOrganizations', name: 'All Organizations' },
    ];

    return (
      <Tabs
        fill
        justify
        id="controlled-tab-example"
        activeKey={filterTabs}
        onSelect={(k) => setFilterTabs(k)}
        className="mb-1 w-100 idf-tabs"
      >
        <Tab
          eventKey="owners"
          title={
            <span>
              <MaterialIcon icon="person" /> <span> Owners </span>
            </span>
          }
        >
          <div className="px-3 py-2">
            <Filters
              onHandleFilterContact={onHandleFilterOrg}
              dispatch={dispatch}
              filtersItems={filtersItems}
              filterTitle={FILTER_ORGANIZATION}
              callbackService={userService}
              callbackRequest={'getUsers'}
              callbackResponseData={'users'}
              searchPlaceholder={SEARCH_FOR_USER}
              showSelectOnly
            />
          </div>
        </Tab>
        <Tab
          eventKey="filters"
          title={
            <span>
              <MaterialIcon icon="filter_list" /> <span> Filters </span>
            </span>
          }
        >
          <div className="py-2 idf-dropdown-item-list">
            {ORGANIZATION_FILTER_OPTIONS_LIST.map((option) => (
              <Dropdown.Item
                key={option.id}
                href="#"
                onClick={(e) => handleFilterSelect(e, option)}
                className="px-3"
              >
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className={
                      filterOptionSelected.key === option.key ? 'fw-bold' : ''
                    }
                  >
                    {option.name}
                  </span>
                  {filterOptionSelected.key === option.key && (
                    <MaterialIcon icon="check" clazz="fw-bold" />
                  )}
                </div>
              </Dropdown.Item>
            ))}
          </div>
        </Tab>
      </Tabs>
    );
  };

  const handleFilterSelect = (e, status) => {
    setFilterRefresh(true);
    e.preventDefault();
    setOpenFilter(!openFilter);

    let newFilterSelected = {
      ...filterSelected,
    };

    if (status.key === 'MyOrganization') {
      newFilterSelected = {
        ...newFilterSelected,
        filter: { assigned_user_id: [me.id] },
      };
    } else if (status.key === 'AllOrganizations') {
      newFilterSelected = {
        ...newFilterSelected,
        filter: { assigned_user_id: null },
      };
    } else if (status.key === 'RecentlyViewed') {
      newFilterSelected = {
        ...newFilterSelected,
        filter: { recent_activity: true },
      };
    }

    const hasFilters = Object.keys(newFilterSelected.filter);

    if (!hasFilters.length) delete newFilterSelected.filter;

    setFilterSelected(newFilterSelected);

    setFilterOptionSelected(status);
  };

  async function onGetUsers() {
    const response = await userService
      .getUsers(
        {
          search: '',
          users: [],
          filters: '',
        },
        {}
      )
      .catch((err) => err);

    const { data } = response || {};

    const newFilterOptions = filtersItems.slice();

    newFilterOptions.push({
      id: newFilterOptions.length,
      label: OWNER,
      name: 'assigned_user_id',
      options: data?.users,
      type: 'search',
    });

    setFiltersItems(newFilterOptions);
  }

  const getOrganizations = async (count) => {
    setShowLoading(true);

    const organizations = await organizationService
      .getOrganizations(
        { ...filterSelected, order, deleted: false },
        {
          page: filterRefresh ? 1 : paginationPage.page,
          limit: 15,
        }
      )
      .catch((err) => console.log(err));

    const { data } = organizations || {};

    setAllOrganizations(data?.organizations);
    setPagination(data?.pagination);

    setDataInDB(count ? Boolean(data?.pagination?.count) : false);
    setShowLoading(false);
  };

  useEffect(async () => {
    onGetUsers();
    getOrganizations(true);

    const me = await getCurrentUser().catch((err) => console.log(err));

    setMe(me);

    dispatchFormData({
      type: 'set',
      input: 'assigned_user_id',
      payload: me?.id,
    });
  }, []);

  useEffect(() => {
    getOrganizations(true);
  }, [paginationPage, modified, order]);

  useEffect(() => {
    if (filterSelected) {
      getOrganizations(true);
    }
  }, [filterSelected]);

  const getCurrentUser = async () => {
    const user = await userService
      .getUserInfo()
      .catch((err) => console.error(err));

    return user;
  };

  const deleteOrganizations = async (selectedData) => {
    await organizationService
      .deleteOrganizations(selectedData)
      .then((response) => {
        setDeleteResults(response);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  const handleDelete = async () => {
    await deleteOrganizations(selectedData);
    setSelectedData([]);
    setShowDeleteReport(true);
  };

  const openDeleteModal = () => {
    setShowDeleteOrgModal(true);
  };

  const data = allOrganizations?.map((organization) => {
    return {
      ...organization,
      dataRow: [
        {
          key: 'name',
          component: (
            <Link
              to={`${routes.contacts}/${organization.id}/organization/profile`}
              className="text-black fw-bold"
            >
              {organization.name}
            </Link>
          ),
        },
        {
          key: 'label',
          label: 'label',
          component: organization?.label ? (
            <Badge
              id={organization.label.id}
              style={{
                fontSize: '11px',
                backgroundColor: `${organization.label.color}`,
              }}
              className="text-uppercase p-2"
            >
              {organization?.label?.name}
            </Badge>
          ) : null,
        },
        {
          key: 'address',
          label: 'address',
          component: (
            <span>
              {`            
              ${
                organization.address_city
                  ? organization.address_city + ', '
                  : ''
              } 
              ${organization.address_state ? organization.address_state : ''} 
              ${
                organization.address_country ? organization.address_country : ''
              }
            `}
            </span>
          ),
        },
        {
          key: 'phone',
          label: 'phone',
          component: <span>{organization.phone_office}</span>,
        },
        {
          key: 'total_revenue',
          label: 'total_revenue',
          component:
            organization.annual_revenue > 999 &&
            organization.annual_revenue < 1000000
              ? (organization.annual_revenue / 1000).toFixed(2) + 'K'
              : organization.annual_revenue > 999999 &&
                organization.annual_revenue < 100000000
              ? (organization.annual_revenue / 1000000).toFixed(2) + 'M'
              : organization.annual_revenue > 99999999
              ? (organization.annual_revenue / 100000000).toFixed(2) + 'B'
              : organization.annual_revenue < 1000 &&
                organization.annual_revenue > 0
              ? organization.annual_revenue
              : '0',
        },
        {
          key: 'employees',
          label: 'employees',
          component: <span>{organization.employees || 0}</span>,
        },
      ],
    };
  });

  const onHandleFilterOrg = (item) => {
    setFilterRefresh(true);
    const newFilterSelected = {
      ...filterSelected,
      filter: item && item.id ? { assigned_user_id: [item.id] } : filters,
    };
    const hasFilters = Object.keys(newFilterSelected.filter);
    if (!hasFilters.length) delete newFilterSelected.filter;

    setFilterSelected(newFilterSelected);
    setOpenFilter(false);

    setFilterOptionSelected({
      key: item.id,
      name: `Owner: ${item?.first_name} ${item?.last_name}`,
    });
  };

  const toggle = () => setModal(!modal);

  const onHandleSubmit = async () => {
    setLoading(true);

    if (!orgFormData.name) {
      setLoading(false);

      return setErrorMessage(EMPTY_ORG_NAME);
    }

    // set US as country for now
    orgFormData.address_country = 'USA';

    // here splitting address back to what API needs
    orgFormData.address_street = orgFormData?.address_full
      ? splitAddress(orgFormData.address_full)?.address
      : '';

    const newContact = await organizationService
      .createOrganization(orgFormData)
      .catch((err) => console.log(err));

    if (newContact) {
      await Promise.all(
        preOwners?.map(async (item) => {
          await new Promise((resolve) => {
            organizationService
              .addOwner(newContact?.data?.id, item.user_id)
              .then(resolve);
          });
        })
      );

      getOrganizations(true);
      dispatchFormData({
        type: 'load',
        payload: {
          ...initialOrgForm,
          assigned_user_id: me?.id,
        },
      });
      setPreOwners([]);
      setSuccessMessage(ORGANIZATION_CREATED);

      toggle();
    }

    setLoading(false);
  };

  const loader = () => {
    if (showLoading) return <Loading />;
  };

  const onClose = () => {
    onHandleCloseModal(dispatchFormData, toggle, 'reset-Form');
  };

  const sortTable = ({ name }) => sortingTable({ name, order, setOrder });

  const handleRowClick = (row, col) => {
    row.dataRow &&
      (col.key === 'name' ||
        col.key === 'owner' ||
        (window.location = row.dataRow[0].component.props.to));
  };

  const handleClearSelection = () => {
    setSelectAll(false);
    setSelectedData([]);
  };

  return (
    <div>
      <LayoutHead
        onHandleCreate={toggle}
        buttonLabel={'Add Organization'}
        selectedData={selectedData}
        onDelete={openDeleteModal}
        allRegister={`${pagination.count || 0} Organizations`}
        dataInDB={dataInDB}
        onClear={handleClearSelection}
      >
        <Dropdown show={openFilter} onToggle={setOpenFilter}>
          <Dropdown.Toggle
            variant="white"
            className="btn btn-sm btn-white dropdown-toggle"
            id="dropdown-basic"
          >
            <div className="d-flex">
              <MaterialIcon icon="filter_list" clazz="mr-1" />
              <p
                className="d-inline-block text-truncate mb-0"
                style={{ maxWidth: 100 }}
              >
                {filterOptionSelected.name || 'Filters'}
              </p>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu
            className="p-0 dropdown-center"
            style={{ minWidth: 320 }}
          >
            <OrganizationFilterTabs />
          </Dropdown.Menu>
        </Dropdown>
        <Link to={routes.importOrg} className="btn btn-white btn-sm ml-2">
          <i className="material-icons-outlined">upload</i> Import
        </Link>
      </LayoutHead>
      {showDeleteOrgModal && (
        <DeleteModal
          type="organizations"
          showModal={showDeleteOrgModal}
          setShowModal={setShowDeleteOrgModal}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          event={handleDelete}
          data={allOrganizations}
          results={deleteResults}
          setResults={setDeleteResults}
          showReport={showDeleteReport}
          setShowReport={setShowDeleteReport}
          modified={modified}
          setModified={setModified}
          constants={organizationConstants.delete}
        />
      )}
      {/* <DataFilters
          filterSelected={filterSelected}
          setFilterSelected={setFilterSelected}
          searchPlaceholder={SEARCH_ORGANIZATIONS}
          paginationPage={paginationPage}
          setPaginationPage={setPaginationPage}
        > */}

      {/* </DataFilters> */}
      <Card className="mb-5">
        <Card.Body className="p-0">
          <div className="table-responsive-md datatable-custom">
            <div
              id="datatable_wrapper"
              className="dataTables_wrapper no-footer"
            >
              {showLoading ? (
                loader()
              ) : (
                <Table
                  checkbox
                  columns={organizationColumns}
                  data={data}
                  selectAll={selectAll}
                  setSelectAll={setSelectAll}
                  selectedData={selectedData}
                  setSelectedData={setSelectedData}
                  onPageChange={(newPage) =>
                    changePaginationPage(newPage, setPaginationPage)
                  }
                  paginationInfo={pagination}
                  usePagination
                  title="organization"
                  dataInDB={dataInDB}
                  emptyDataText="No organizations available yet."
                  toggle={toggle}
                  sortingTable={sortTable}
                  onClickCol={handleRowClick}
                />
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <SimpleModalCreation
        modalTitle={ADD_ORGANIZATION}
        open={modal}
        toggle={onClose}
        handleSubmit={onHandleSubmit}
        onHandleCloseModal={() =>
          onHandleCloseModal(dispatchFormData, toggle, 'reset-orgForm')
        }
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        isLoading={loading}
        onClick={() => document.dispatchEvent(new MouseEvent('click'))}
      >
        <OrganizationForm
          dispatch={dispatchFormData}
          orgFormData={orgFormData}
          fields={organizationFormFields}
          refresh={() => getOrganizations(true)}
          me={me}
          isprincipalowner="true"
          service={organizationService}
          prevalue="true"
          preowners={preOwners}
          setPreOwners={setPreOwners}
          fromNavBar
        />
      </SimpleModalCreation>

      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
        <Alert
          color="success"
          message={successMessage}
          setMessage={setSuccessMessage}
        />
      </AlertWrapper>
    </div>
  );
};

export default Organizations;
