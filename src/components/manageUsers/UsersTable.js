import { useEffect, useState } from 'react';
import { capitalize } from 'lodash';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

import userService from '../../services/user.service';
import { paginationDefault, ADD_USERS } from '../../utils/constants';
import { setDateFormat } from '../../utils/Utils';
import Avatar from '../Avatar';
import Table from '../GenericTable';
import Loading from '../Loading';
import { DataFilters } from '../DataFilters';
import Filters from './Filters';
import { changePaginationPage } from '../../views/Deals/contacts/utils';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import InvitationModal from '../modal/InvitationModal.component';
import { usersColumns } from './ManageUsers.constants';
import LayoutHead from '../commons/LayoutHead';
import { sortingTable } from '../../utils/sortingTable';
import DeleteModal from '../modal/DeleteModal';
import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.settings.users;

const UsersTable = ({ paginationPage, setPaginationPage }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [filter, setFilter] = useState({});
  const [pagination, setPagination] = useState(paginationDefault);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [dataInDB, setDataInDB] = useState(false);
  const [order, setOrder] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [modified, setModified] = useState(false);
  const [deleteResults, setDeleteResults] = useState([]);

  useEffect(() => {
    getUsers(true);
  }, []);

  useEffect(() => {
    getUsers();
  }, [filter, paginationPage, order]);

  const getUsers = async (count) => {
    setShowLoading(true);

    if (filter.status === 'all') {
      delete filter.status;
    }

    if (!filter.role) {
      delete filter.role;
    }

    const users = await userService
      .getUsers(
        { ...filter, order },
        {
          page: paginationPage.page,
          limit: 10,
        }
      )
      .catch((err) => console.log(err));

    const { data } = users || {};

    setAllUsers(data?.users);
    setPagination(data?.pagination);
    if (count) setDataInDB(Boolean(data?.pagination?.totalPages));

    setShowLoading(false);
  };

  const loader = () => {
    if (showLoading) return <Loading />;
  };

  const onHandleFilterUsers = ({ filterUsers, roleId }) => {
    setFilter({
      status: filterUsers,
      role: roleId,
    });
  };

  const onHandleDelete = async () => {
    try {
      const response = await userService.removeUsers(selectedData);
      setDeleteResults(response);
      setShowReport(true);
      getUsers();
    } catch (error) {}
  };

  const data = allUsers?.map((user) => ({
    ...user,
    dataRow: [
      {
        key: 'user',
        component: (
          <Link
            className="text-black fw-bold"
            to={`/settings/users/${user.id}`}
          >
            <div className="media">
              <div className="avatar avatar-sm avatar-circle mr-3">
                <Avatar user={user} />
              </div>
              <div className="media-body">
                <div>
                  <h5 className="mb-0">
                    {!user.first_name && !user.last_name
                      ? 'Invited'
                      : `${user.first_name || ''} ${user.last_name || ''}`}
                  </h5>
                  <span className="d-block text-muted font-size-sm">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ),
      },
      {
        key: 'role',
        component: <span>{user?.roleInfo?.name}</span>,
      },
      {
        key: 'status',
        component: <span>{capitalize(user?.status)}</span>,
      },
      {
        key: 'tenant',
        onlyAdmin: true,
        component: <span>{user?.tenant?.name}</span>,
      },
      {
        key: 'last_login',
        component: (
          <span>
            {user.last_access ? setDateFormat(user.last_access) : 'N/A'}
          </span>
        ),
      },
    ],
  }));

  const sortTable = ({ name }) => sortingTable({ name, order, setOrder });

  return (
    <>
      <DeleteModal
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        showModal={showModal}
        setShowModal={setShowModal}
        event={onHandleDelete}
        constants={constants.delete}
        modified={modified}
        setModified={setModified}
        type="contacts"
        data={data}
        results={deleteResults}
        setResults={setDeleteResults}
        showReport={showReport}
        setShowReport={setShowReport}
      />
      <LayoutHead
        onHandleCreate={() => setShowInvitationModal(true)}
        buttonLabel={ADD_USERS}
        selectedData={selectedData}
        onDelete={setShowModal.bind(true)}
        labelButtonDelete="Suspend User"
        allRegister={`${pagination.count || 0} Users`}
        toggle={() => setShowInvitationModal(true)}
        dataInDB={dataInDB}
      >
        <Filters onHandleFilterUsers={onHandleFilterUsers} />
      </LayoutHead>

      <Card className="mb-5">
        <Card.Header>
          <DataFilters
            filterSelected={filter}
            setFilterSelected={setFilter}
            searchPlaceholder="Search users"
            paginationPage={paginationPage}
            setPaginationPage={setPaginationPage}
          />
        </Card.Header>
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
                  checkbox={true}
                  columns={usersColumns}
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
                  toggle={() => setShowInvitationModal(true)}
                  emptyDataText="No users available yet."
                  title="user"
                  dataInDB={dataInDB}
                  sortingTable={sortTable}
                />
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <InvitationModal
        showModal={showInvitationModal}
        setShowModal={setShowInvitationModal}
      />

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
    </>
  );
};

export default UsersTable;
