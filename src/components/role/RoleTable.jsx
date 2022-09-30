import React from 'react';
import { useHistory } from 'react-router';

import Table from '../GenericTable';
import routes from '../../utils/routes.json';

const RoleTable = ({
  dataSource = [],
  selectAll,
  setSelectAll,
  selectedData,
  setSelectedData,
  paginationInfo,
  onPageChange,
  dataInDB,
  setShowCreateRoleModal,
  sortingTable,
}) => {
  const history = useHistory();
  const columns = [
    {
      key: 'roleName',
      orderBy: 'name',
      component: 'Role Name',
    },
    {
      key: 'description',
      orderBy: 'description',
      component: 'Description',
    },
    {
      key: 'isAdmin',
      orderBy: 'admin_access',
      component: 'Is Admin',
    },
  ];

  const data = dataSource.map((dataItem) => ({
    ...dataItem,
    dataRow: [
      {
        key: 'name',
        component: (
          <h5
            onClick={() => {
              history.push(`${routes.roles}/${dataItem.id}`);
            }}
          >
            {dataItem.name}
          </h5>
        ),
        id: dataItem.id,
      },
      {
        key: 'description',
        component: (
          <span
            onClick={() => {
              history.push(`${routes.roles}/${dataItem.id}`);
            }}
          >
            {dataItem.description}
          </span>
        ),
      },
      {
        key: 'isAdmin',
        component: (
          <span
            onClick={() => {
              history.push(`${routes.roles}/${dataItem.id}`);
            }}
          >
            {dataItem.admin_access ? 'Yes' : 'No'}
          </span>
        ),
      },
    ],
  }));

  return (
    <div className="table-responsive-md datatable-custom">
      <Table
        checkbox
        columns={columns}
        data={data}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        paginationInfo={paginationInfo}
        onPageChange={onPageChange}
        clickableCell
        emptyDataText="No Roles available yet."
        title="Role"
        dataInDB={dataInDB}
        toggle={() => setShowCreateRoleModal(true)}
        sortingTable={sortingTable}
      />
    </div>
  );
};

export default RoleTable;
