import React, { useState, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import { Card, Dropdown, Tab, Tabs } from 'react-bootstrap';

import Filters from '../../../components/Filters';
import Table from '../../../components/GenericTable';
import Alert from '../../../components/Alert/Alert';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import {
  initialFilters,
  initialFiltersItems,
  initialPeopleForm,
  peopleColumns,
} from './Contacts.constants';
import contactService from '../../../services/contact.service';
import {
  EMPTY_NAME,
  FILTER_PEOPLE,
  INVALID_EMAIL,
  OWNER,
  paginationDefault,
  CONTACT_CREATED,
  SEARCH_FOR_USER,
  ADD_CONTACT,
} from '../../../utils/constants';
import SimpleModalCreation from '../../../components/modal/SimpleModalCreation';
import { validateEmail } from '../../../utils/Utils';
import PeopleForm from '../../../components/peoples/PeopleForm';
import { changePaginationPage, onHandleCloseModal, reducer } from './utils';
import userService from '../../../services/user.service';
import Loading from '../../../components/Loading';
import routes from '../../../utils/routes.json';
import IdfOwnersHeader from '../../../components/idfComponents/idfAdditionalOwners/IdfOwnersHeader';
import DeleteModal from '../../../components/modal/DeleteModal';
import stringConstants from '../../../utils/stringConstants.json';
import LayoutHead from '../../../components/commons/LayoutHead';
import { sortingTable } from '../../../utils/sortingTable';
import MaterialIcon from '../../../components/commons/MaterialIcon';

const contactConstants = stringConstants.deals.contacts;

const Peoples = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [modal, setModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [filterSelected, setFilterSelected] = useState({});
  const [filtersItems, setFiltersItems] = useState(initialFiltersItems);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [allOwners, setAllOwners] = useState([]);
  const [pagination, setPagination] = useState(paginationDefault);
  const [paginationPage, setPaginationPage] = useState(paginationDefault);
  const [filters, dispatch] = useReducer(reducer, initialFilters);
  const [peopleFormData, dispatchFormData] = useReducer(
    reducer,
    initialPeopleForm
  );
  const [modified, setModified] = useState(false);
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
  const [deleteResults, setDeleteResults] = useState([]);
  const [showDeleteReport, setShowDeleteReport] = useState(false);
  const [dataInDB, setDataInDB] = useState(false);
  const [me, setMe] = useState(null);
  const [preOwners, setPreOwners] = useState([]);
  const [order, setOrder] = useState([]);

  const [openFilter, setOpenFilter] = useState(false);
  const [filterTabs, setFilterTabs] = useState('filters');
  const [filterOptionSelected, setFilterOptionSelected] = useState({
    id: 3,
    key: 'AllContacts',
    name: 'All Contacts',
  });

  const PeoplesFilterTabs = () => {
    const PEOPLES_FILTER_OPTIONS_LIST = [
      { id: 1, key: 'RecentlyViewed', name: 'Recently Viewed' },
      { id: 2, key: 'MyContacts', name: 'My Contacts' },
      { id: 3, key: 'AllContacts', name: 'All Contacts' },
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
              filterTitle={FILTER_PEOPLE}
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
            {PEOPLES_FILTER_OPTIONS_LIST.map((option) => (
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
    e.preventDefault();
    setOpenFilter(!openFilter);

    let newFilterSelected = {
      ...filterSelected,
    };

    if (status.key === 'MyContacts') {
      newFilterSelected = {
        ...newFilterSelected,
        filter: { assigned_user_id: [me.id] },
      };
    } else if (status.key === 'AllContacts') {
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

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
    }
  }, [successMessage]);

  const getCurrentUser = async () => {
    const me = await userService
      .getUserInfo()
      .catch((err) => console.error(err));

    setMe(me);
  };

  const getContacts = async (count) => {
    setShowLoading(true);
    const contacts = await contactService
      .getContact(
        { ...filterSelected, order, deleted: false },
        {
          page: paginationPage.page,
          limit: 15,
        }
      )
      .catch((err) => console.log(err));

    const { data } = contacts || {};

    setAllContacts(data?.contacts);
    setPagination(data?.pagination);

    setDataInDB(count ? Boolean(data?.pagination?.totalPages) : false);
    setShowLoading(false);
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
    setAllOwners(response?.users);
  }

  useEffect(() => {
    onGetUsers();
    getContacts(true);
    getCurrentUser();
  }, []);

  useEffect(() => {
    getContacts(true);
  }, [filterSelected, paginationPage, modified, order]);

  const onHandleFilterOrg = (item) => {
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

  const data = allContacts?.map((contact) => {
    const isPrincipalOwner =
      me && contact
        ? me?.roleInfo?.admin_access ||
          me?.roleInfo?.owner_access ||
          contact?.assigned_user_id === me?.id
        : false;

    return {
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
              to={`/contacts/${contact.organization?.id}/organization/profile`}
              className="text-black"
            >
              {contact.organization?.name}
            </Link>
          ),
        },
        {
          key: 'label',
          label: 'label',
          component: contact?.label ? (
            <Badge
              id={contact.label.id}
              style={{
                fontSize: '12px',
                backgroundColor: `${contact.label.color}`,
              }}
              className="text-uppercase w-100"
            >
              {contact.label.name}
            </Badge>
          ) : null,
        },
        {
          key: 'email',
          label: 'email',
          component: (
            <span>
              {contact.email_work ||
                contact.email_home ||
                contact.email_mobile ||
                contact.email_other}
            </span>
          ),
        },
        {
          key: 'phone',
          label: 'phone',
          component: (
            <span>
              {contact.phone_work ||
                contact.phone_home ||
                contact.phone_mobile ||
                contact.phone_other}
            </span>
          ),
        },
        {
          key: 'total_closed_deals',
          label: 'total_closed_deals',
          component: <span>{contact.total_closed_deals || 0}</span>,
        },
        {
          key: 'total_open_deals',
          label: 'total_open_deals',
          component: <span>{contact.total_open_deals || 0}</span>,
        },
        {
          key: 'owner',
          label: 'owner',
          component: (
            <IdfOwnersHeader
              mainOwner={contact.assigned_user}
              service={contactService}
              serviceId={contact.id}
              listOwners={contact.owners}
              defaultSize="xs"
              isprincipalowner={isPrincipalOwner}
              small
            />
          ),
        },
      ],
    };
  });

  const toggle = () => setModal(!modal);

  const onHandleSubmit = async () => {
    setLoading(true);

    if (!peopleFormData.first_name || !peopleFormData.last_name) {
      setLoading(false);

      return setErrorMessage(EMPTY_NAME);
    }

    const isEmail = peopleFormData.email && validateEmail(peopleFormData.email);

    if (peopleFormData.email && !isEmail) {
      setLoading(false);

      return setErrorMessage(INVALID_EMAIL);
    }

    const newContact = await contactService
      .createContact(peopleFormData)
      .catch((err) => console.log(err));

    if (newContact) {
      await Promise.all(
        preOwners?.map(async (item) => {
          await new Promise((resolve) => {
            contactService
              .addOwner(newContact?.data?.id, item.user_id)
              .then(resolve);
          });
        })
      );

      getContacts(true);
      dispatchFormData({
        type: 'reset-peopleForm',
      });
      setPreOwners([]);
      setSuccessMessage(CONTACT_CREATED);
      toggle();
    }

    setLoading(false);
  };

  const deleteContacts = async (selectedData) => {
    await contactService
      .deleteContacts(selectedData)
      .then((response) => {
        setDeleteResults(response);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  const handleDelete = async () => {
    await deleteContacts(selectedData);
    setSelectedData([]);
    setShowDeleteReport(true);
  };

  const openDeleteModal = () => {
    setShowDeleteContactModal(true);
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
        col.key === 'organization' ||
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
        buttonLabel={ADD_CONTACT}
        selectedData={selectedData}
        onDelete={openDeleteModal}
        allRegister={`${pagination.count || 0} People`}
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
            <PeoplesFilterTabs />
          </Dropdown.Menu>
        </Dropdown>

        <Link to={routes.importPeople} className="btn btn-white btn-sm ml-2">
          <i className="material-icons-outlined">upload</i> Import
        </Link>
      </LayoutHead>
      {showDeleteContactModal && (
        <DeleteModal
          type="contacts"
          showModal={showDeleteContactModal}
          setShowModal={setShowDeleteContactModal}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          event={handleDelete}
          data={allContacts}
          results={deleteResults}
          setResults={setDeleteResults}
          showReport={showDeleteReport}
          setShowReport={setShowDeleteReport}
          modified={modified}
          setModified={setModified}
          constants={contactConstants.delete}
        />
      )}
      {/* <div className="card-body">
        <DataFilters
          filterSelected={filterSelected}
          setFilterSelected={setFilterSelected}
          searchPlaceholder={SEARCH_CONTACTS}
          paginationPage={paginationPage}
          setPaginationPage={setPaginationPage}
        >
        </DataFilters>
      </div> */}

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
                  showLoading={showLoading}
                  columns={peopleColumns}
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
                  title="people"
                  emptyDataText="No people available yet."
                  dataInDB={dataInDB}
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
        modalTitle={ADD_CONTACT}
        open={modal}
        toggle={onClose}
        handleSubmit={onHandleSubmit}
        onHandleCloseModal={() =>
          onHandleCloseModal(dispatchFormData, toggle, 'reset-peopleForm')
        }
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        isLoading={loading}
        onClick={() => document.dispatchEvent(new MouseEvent('click'))}
      >
        <PeopleForm
          dispatch={dispatchFormData}
          allUsers={allOwners}
          peopleFormData={peopleFormData}
          refresh={() => getContacts(true)}
          isprincipalowner="true"
          prevalue="true"
          preowners={preOwners}
          setPreOwners={setPreOwners}
        />
      </SimpleModalCreation>
      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
      </AlertWrapper>
    </div>
  );
};

export default Peoples;
