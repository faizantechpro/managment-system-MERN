import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

import GroupTable from '../../../components/groups/GroupTable';
import groupService from '../../../services/groups.service';
import stringConstants from '../../../utils/stringConstants.json';
import CreateGroupModal from '../../../components/groups/CreateGroupModal';
import Search from '../../../components/manageUsers/Search';
import Alert from '../../../components/Alert/Alert';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import LayoutHead from '../../../components/commons/LayoutHead';
import { sortingTable } from '../../../utils/sortingTable';
import DeleteModal from '../../../components/modal/DeleteModal';

const constants = stringConstants.settings.groups;

const DataFilters = ({ filter, setFilter }) => {
  const onHandleChange = (e) => {
    setFilter({
      ...filter,
      search: e.target.value,
    });
  };

  return (
    <div className="row justify-content-between align-items-center flex-grow-1 p-3">
      <Search onHandleChange={onHandleChange} />
    </div>
  );
};

const Groups = () => {
  const defaultPagination = { page: 1, limit: 10 };
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [allGroups, setAllGroups] = useState([]);
  const [allParents, setAllParents] = useState([]);
  const [filter, setFilter] = useState({});
  const [pagination, setPagination] = useState(defaultPagination);
  const [selectedData, setSelectedData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dataInDB, setDataInDB] = useState(false);
  const [order, setOrder] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modified, setModified] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [deleteResult, setDeleteResult] = useState([]);

  const getGroups = async (filter, { page = 1, limit = 10 }) =>
    await groupService.getGroups(filter, { page, limit, order });

  const getListGroups = async (count, page = 1, limit = 10) => {
    try {
      const { search } = filter;
      const result = await getGroups(filter, { page, limit });
      const { data, pagination } = result;
      const parents = data.filter((item) => !item.parent);

      setPagination(pagination);
      setAllGroups(data);
      if (count) setDataInDB(Boolean(result?.pagination?.totalPages));

      if (!search?.length) setAllParents(parents);
    } catch (error) {
      setErrorMessage(constants.create.errorGetGroups);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await groupService.deleteGroup(selectedData);
      setDeleteResult(result);
      setShowReport(true);
    } catch (error) {}
  };

  const getParents = async (search) => {
    const result = await getGroups({ search });
    const { data } = result;
    const parents = data.filter((item) => !item.parent);
    setAllParents(parents);
  };

  useEffect(() => getListGroups(true), []);

  useEffect(() => {
    if (openModal === false) {
      getListGroups();
    }
  }, [filter, order, openModal]);

  const changePaginationPage = (newPage) => {
    getListGroups(null, newPage);
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const createGroup = async (groupName, parentGroup) => {
    try {
      await groupService.CreateGroup({
        name: groupName,
        parent_id: parentGroup?.id,
      });
      getListGroups();
      setSuccessMessage(constants.create.groupCreatedSuccess);
    } catch (error) {
      setErrorMessage(constants.create.groupCreatedFailed);
    }
  };

  const closeModal = async () => {
    setShowCreateGroupModal(false);
    setFilter({});
  };

  const sortTable = ({ name }) => sortingTable({ name, order, setOrder });

  return (
    <>
      <AlertWrapper>
        <Alert
          color="success"
          message={successMessage}
          setMessage={setSuccessMessage}
        />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <DeleteModal
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        showModal={openModal}
        setShowModal={setOpenModal}
        event={handleDelete}
        data={allGroups}
        type="groups"
        showReport={showReport}
        setShowReport={setShowReport}
        constants={constants}
        modified={modified}
        setModified={setModified}
        results={deleteResult}
        setResults={setDeleteResult}
      />
      <LayoutHead
        onHandleCreate={() => setShowCreateGroupModal(true)}
        buttonLabel={constants.edit.add}
        allRegister={`${pagination.count || 0} Groups`}
        dataInDB={dataInDB}
        selectedData={selectedData}
        onDelete={setOpenModal.bind(true)}
      />
      <Card className="mb-5">
        <Card.Header className="p-0">
          <DataFilters setFilter={setFilter} />
        </Card.Header>
        <Card.Body className="p-0">
          <GroupTable
            dataSource={allGroups}
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            paginationInfo={pagination}
            onPageChange={changePaginationPage}
            dataInDB={dataInDB}
            sortingTable={sortTable}
          />
        </Card.Body>
      </Card>

      <CreateGroupModal
        showModal={showCreateGroupModal}
        setShowModal={closeModal}
        data={allParents}
        createGroup={createGroup}
        setErrorMessage={setErrorMessage}
        onChangeDrop={(e) => (e?.target ? getParents(e.target.value) : null)}
      />
    </>
  );
};

export default Groups;
