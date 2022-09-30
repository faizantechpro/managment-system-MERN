import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataFilters } from '../../components/DataFilters';
import Filters from '../../components/Filters';
import Loading from '../../components/Loading';
import userService from '../../services/user.service';
import {
  FILTER_ORGANIZATION,
  OWNER,
  paginationDefault,
  SEARCH_ACCOUNTS,
  SEARCH_FOR_USER,
  ORGANIZATION_DELETED,
} from '../../utils/constants';
import Alert from '../../components/Alert/Alert';
import AlertWrapper from '../../components/Alert/AlertWrapper';
import Table from '../../components/GenericTable';
import { organizationsAccountsColumns } from './Accounts.constants';
import LayoutTableView from '../../components/LayoutTableView';
import { changePaginationPage, reducer } from '../Deals/contacts/utils';
import { initialFilters } from '../Deals/contacts/Contacts.constants';
import organizationService from '../../services/organization.service';
import DeleteConfirmationModal from '../../components/organizations/DeleteConfirmationModal';
import routes from '../../utils/routes.json';

const OrganizationsAccounts = () => {
  const [paginationPage, setPaginationPage] = useState(paginationDefault);
  const [showLoading, setShowLoading] = useState(false);
  const [pagination, setPagination] = useState(paginationDefault);
  const [filterSelected, setFilterSelected] = useState({});
  const [filtersItems, setFiltersItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [filters, dispatch] = useReducer(reducer, initialFilters);

  useEffect(() => {
    onGetUsers();
  }, []);

  useEffect(() => {
    getOrganizations();
  }, [filterSelected, paginationPage]);

  async function onGetUsers() {
    const response = await userService
      .getUsers(null, { limit: 10 })
      .catch((err) => err);

    const { data } = response || {};

    const newFilterOptions = filtersItems.slice();

    newFilterOptions.push({
      id: 2,
      label: OWNER,
      name: 'assigned_user_id',
      options: data?.users,
      type: 'search',
    });

    setFiltersItems(newFilterOptions);
  }

  const getOrganizations = async () => {
    setShowLoading(true);

    const organizations = await organizationService
      .getOrganizations(
        { ...filterSelected, deleted: false, is_customer: true, cif: true },
        {
          page: paginationPage.page,
          limit: 10,
        }
      )
      .catch((err) => console.log(err));

    const { data } = organizations || {};

    setAllOrganizations(data?.organizations);
    setPagination(data?.pagination);
    setShowLoading(false);
  };

  const deleteOrganizations = async () => {
    setShowLoading(true);

    await organizationService
      .deleteOrganizations(selectedData)
      .then(() => {
        setSuccessMessage(ORGANIZATION_DELETED);
        getOrganizations();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setSelectedData([]);
        setShowLoading(false);
        setShowModal(false);
      });
  };

  const handleDelete = () => {
    setShowModal(true);
  };

  const onHandleFilterOrg = () => {
    const newFilterSelected = {
      ...filterSelected,
      filter: filters,
    };

    const hasFilters = Object.keys(newFilterSelected.filter);

    if (!hasFilters.length) delete newFilterSelected.filter;

    setFilterSelected(newFilterSelected);
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
          key: 'address',
          label: 'address',
          component: (
            <span>
              {`              
              ${
                organization.address_street
                  ? organization.address_street + ', '
                  : ''
              } 
              ${
                organization.address_city
                  ? organization.address_city + ', '
                  : ''
              } 
              ${
                organization.address_state
                  ? organization.address_state + ', '
                  : ''
              } 
              ${
                organization.address_country ? organization.address_country : ''
              }
            `}
            </span>
          ),
        },
        {
          key: 'total_transactions',
          label: 'total_transactions',
          component: <span>{0}</span>,
        },
        {
          key: 'total_amount_processed',
          label: 'total_amount_processed',
          component: <span>{0}</span>,
        },
        {
          key: 'owner',
          label: 'owner',
          component: (
            <span>{`${organization.assigned_user?.first_name || 'd'} ${
              organization.assigned_user?.last_name || 's'
            }`}</span>
          ),
        },
      ],
    };
  });

  const loader = () => {
    if (showLoading) return <Loading />;
  };

  return (
    <LayoutTableView cleaned>
      <AlertWrapper className="alert-position">
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
      <DeleteConfirmationModal
        handleSubmit={deleteOrganizations}
        showModal={showModal}
        setShowModal={setShowModal}
        selectedData={selectedData}
      />
      <div className="card-body">
        <DataFilters
          filterSelected={filterSelected}
          setFilterSelected={setFilterSelected}
          searchPlaceholder={SEARCH_ACCOUNTS}
          paginationPage={paginationPage}
          setPaginationPage={setPaginationPage}
        >
          {selectedData.length > 0 && (
            <div className={`mr-2 mb-2 mb-sm-0`}>
              <div className="d-flex align-items-center">
                <span className="font-size-sm mr-3">
                  <span>{`${selectedData.length} Selected`}</span>
                </span>
                <div
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleDelete}
                >
                  <i className="material-icons-outlined">delete</i>
                  Delete
                </div>
              </div>
            </div>
          )}
          <Filters
            onHandleFilterContact={onHandleFilterOrg}
            dispatch={dispatch}
            filtersItems={filtersItems}
            filterTitle={FILTER_ORGANIZATION}
            callbackService={userService}
            callbackRequest={'getUsers'}
            callbackResponseData={'users'}
            searchPlaceholder={SEARCH_FOR_USER}
          />
        </DataFilters>
      </div>

      <div className="table-responsive-md datatable-custom">
        <div id="datatable_wrapper" className="dataTables_wrapper no-footer">
          {showLoading ? (
            loader()
          ) : (
            <Table
              checkbox
              columns={organizationsAccountsColumns}
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
            />
          )}
        </div>
      </div>
    </LayoutTableView>
  );
};

export default OrganizationsAccounts;
