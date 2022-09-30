import React from 'react';
import { useHistory } from 'react-router';

import { setDateFormat } from '../../utils/Utils';
import Table from '../GenericTable';
import routes from '../../utils/routes.json';
import { columnsTableGroups } from '../../utils/constants';

const GroupTable = ({
  dataSource = [],
  selectAll,
  setSelectAll,
  selectedData,
  setSelectedData,
  paginationInfo,
  onPageChange,
  setShowCreateGroupModal,
  dataInDB,
  sortingTable,
}) => {
  const history = useHistory();

  const data = dataSource.map((dataItem) => ({
    ...dataItem,
    dataRow: [
      {
        key: 'groupName',
        component: (
          <h5
            onClick={() => {
              history.push(`${routes.groups}/${dataItem.id}`);
            }}
          >
            {dataItem.name}
          </h5>
        ),
        id: dataItem.id,
      },
      {
        key: 'parentGroup',
        component: (
          <span
            onClick={() => {
              history.push(`${routes.groups}/${dataItem.id}`);
            }}
          >
            {dataItem.parent?.name}
          </span>
        ),
      },
      {
        key: 'lastModification',
        component: (
          <span
            onClick={() => {
              history.push(`${routes.groups}/${dataItem.id}`);
            }}
          >
            {setDateFormat(dataItem.updated_at)}
          </span>
        ),
      },
    ],
  }));

  return (
    <div className="table-responsive-md datatable-custom">
      <Table
        checkbox
        className="table-hover cursor-pointer"
        columns={columnsTableGroups}
        data={data}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        paginationInfo={paginationInfo}
        onPageChange={onPageChange}
        toggle={() => setShowCreateGroupModal(true)}
        emptyDataText="No groups available yet."
        title="group"
        dataInDB={dataInDB}
        sortingTable={sortingTable}
      />
    </div>
  );
};

export default GroupTable;
