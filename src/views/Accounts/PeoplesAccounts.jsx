import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataFilters } from '../../components/DataFilters';
import Filters from '../../components/Filters';
import Loading from '../../components/Loading';
import contactService from '../../services/contact.service';
import userService from '../../services/user.service';
import {
  FILTER_PEOPLE,
  OWNER,
  paginationDefault,
  SEARCH_ACCOUNTS,
  SEARCH_FOR_USER,
} from '../../utils/constants';
import Table from '../../components/GenericTable';
import { peoplesAccountsColumns } from './Accounts.constants';
import LayoutTableView from '../../components/LayoutTableView';
import { changePaginationPage, reducer } from '../Deals/contacts/utils';
import { initialFilters } from '../Deals/contacts/Contacts.constants';
import routes from '../../utils/routes.json';

const Accounts = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [paginationPage, setPaginationPage] = useState(paginationDefault);
  const [showLoading, setShowLoading] = useState(false);
  const [pagination, setPagination] = useState(paginationDefault);
  const [filterSelected, setFilterSelected] = useState({});
  const [filtersItems, setFiltersItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  const [filters, dispatch] = useReducer(reducer, initialFilters);

  useEffect(() => {
    onGetUsers();
  }, []);

  useEffect(() => {
    getContacts();
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

  const getContacts = async () => {
    setShowLoading(true);
    const contacts = await contactService
      .getContact(
        {
          ...filterSelected,
          deleted: false,
          is_customer: true,
          cif: true,
        },
        {
          page: paginationPage.page,
          limit: 10,
        }
      )
      .catch((err) => console.log(err));

    const { data } = contacts || {};

    setAllContacts(data?.contacts);
    setPagination(data?.pagination);
    setShowLoading(false);
  };

  const loader = () => {
    if (showLoading) return <Loading />;
  };

  const data = allContacts?.map((contact) => ({
    ...contact,
    dataRow: [
      {
        key: 'name',
        component: (
          <Link
            to={`${routes.contacts}/${contact.id}/profile`}
            className="text-black fw-bold"
          >
            {`${contact.first_name} ${contact.last_name}`}
          </Link>
        ),
      },
      {
        key: 'organization',
        label: 'organization',
        component: (
          <Link
            to={`${routes.contacts}/${contact.organization?.id}/organization/profile`}
            className="text-black"
          >
            {contact.organization?.name}
          </Link>
        ),
      },
      {
        key: 'email',
        label: 'email',
        component: (
          <span>
            {contact.email_work || contact.email_home || contact.email_mobile}
          </span>
        ),
      },
      {
        key: 'phone',
        label: 'phone',
        component: (
          <span>
            {contact.phone_work || contact.phone_home || contact.phone_mobile}
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
          <span>{`${contact.assigned_user?.first_name || ''} ${
            contact.assigned_user?.last_name || ''
          }`}</span>
        ),
      },
    ],
  }));

  const onHandleFilterContact = () => {
    const newFilterSelected = {
      ...filterSelected,
      filter: filters,
    };

    const hasFilters = Object.keys(newFilterSelected.filter);

    if (!hasFilters.length) delete newFilterSelected.filter;

    setFilterSelected(newFilterSelected);
  };

  return (
    <>
      <LayoutTableView cleaned>
        <div className="card-body">
          <DataFilters
            filterSelected={filterSelected}
            setFilterSelected={setFilterSelected}
            searchPlaceholder={SEARCH_ACCOUNTS}
            paginationPage={paginationPage}
            setPaginationPage={setPaginationPage}
          >
            <Filters
              onHandleFilterContact={onHandleFilterContact}
              dispatch={dispatch}
              filtersItems={filtersItems}
              filterTitle={FILTER_PEOPLE}
              callbackService={userService}
              callbackRequest={'getUsers'}
              callbackResponseData={'users'}
              searchPlaceholder={SEARCH_FOR_USER}
              variant
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
                showLoading={showLoading}
                columns={peoplesAccountsColumns}
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
    </>
  );
};

export default Accounts;
