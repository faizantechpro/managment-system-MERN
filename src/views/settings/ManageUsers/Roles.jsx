import React, { useState, useEffect } from 'react';
import { Card } from 'reactstrap';

import RoleTable from '../../../components/role/RoleTable';
import CreateRoleModal from '../../../components/role/CreateRoleModal';
import DeleteRoleModal from '../../../components/role/DeleteRoleModal';
import Toast from '../../../components/Alert/Alert';
import roleService from '../../../services/role.service';
import stringConstants from '../../../utils/stringConstants.json';
import LayoutHead from '../../../components/commons/LayoutHead';
import { sortingTable } from '../../../utils/sortingTable';

const constants = stringConstants.settings.roles;

const Roles = ({ paginationPage }) => {
  const defaultPagination = { page: 1, limit: 10 };
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
  const [pagination, setPagination] = useState(defaultPagination);
  const [roles, setRoles] = useState([]);
  const [toast, setToast] = useState({ msg: '', color: '' });
  const [selectedData, setSelectedData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modified, setModified] = useState(false);
  const [deleteResults, setDeleteResults] = useState([]);
  const [showDeleteReport, setShowDeleteReport] = useState(false);
  const [dataInDB, setDataInDB] = useState(false);
  const [order, setOrder] = useState([]);

  const getRoles = async (count) => {
    const result = await roleService.GetRoles({ ...pagination, order });
    setRoles(result.data);
    setPagination(result.pagination);
    if (count) setDataInDB(Boolean(result?.pagination?.totalPages));
  };

  const changePaginationPage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const deleteRoles = async (selection) => {
    const deleteReportResults = [];
    const deletedRoles = selection.map(async (roleId, index) => {
      const handleDeleteResponse = (result) => {
        const hasErrors = result?.response?.data?.errors?.length > 0;

        if (hasErrors) {
          deleteReportResults[index] = {
            id: roleId,
            result: constants.delete.failed,
            msg: result.response.data.errors[0].message,
          };
        } else {
          deleteReportResults[index] = {
            id: roleId,
            result: constants.delete.success,
            msg: '',
          };
        }
      };

      return new Promise((resolve) => {
        roleService.deleteRole(roleId).then((response) => {
          handleDeleteResponse(response);
          resolve();
        });
      });
    });

    await Promise.all(deletedRoles);
    setDeleteResults(deleteReportResults);
  };

  const handleDelete = async () => {
    await deleteRoles(selectedData);
    setSelectedData([]);
    setShowDeleteReport(true);
  };

  useEffect(() => {
    getRoles(true);
  }, []);

  useEffect(() => {
    getRoles();
  }, [pagination.page, modified, order]);

  useEffect(() => {
    paginationPage.page === 1 && changePaginationPage(1);
  }, [paginationPage]);

  const sortTable = ({ name }) => sortingTable({ name, order, setOrder });

  return (
    <>
      <Toast message={toast.msg} setMessage={setToast} color={toast.color} />

      <LayoutHead
        onHandleCreate={() => setShowCreateRoleModal(true)}
        buttonLabel={constants.edit.add}
        selectedData={selectedData}
        onDelete={() => setShowDeleteRoleModal(true)}
        allRegister={`${pagination.count || 0} Roles`}
        dataInDB={dataInDB}
      />

      <CreateRoleModal
        showModal={showCreateRoleModal}
        setShowModal={setShowCreateRoleModal}
      />
      <Card className="mb-5">
        <RoleTable
          dataSource={roles}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          selectAll={selectAll}
          setSelectAll={setSelectAll}
          paginationInfo={pagination}
          onPageChange={changePaginationPage}
          dataInDB={dataInDB}
          setShowCreateRoleModal={setShowCreateRoleModal}
          sortingTable={sortTable}
        />
      </Card>

      {showDeleteRoleModal && (
        <DeleteRoleModal
          showModal={showDeleteRoleModal}
          setShowModal={setShowDeleteRoleModal}
          setSelectedRoles={setSelectedData}
          event={handleDelete}
          selectedData={selectedData}
          data={roles}
          results={deleteResults}
          setResults={setDeleteResults}
          showReport={showDeleteReport}
          setShowReport={setShowDeleteReport}
          modified={modified}
          setModified={setModified}
        />
      )}
    </>
  );
};

export default Roles;
