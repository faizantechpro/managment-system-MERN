import React, { useState } from 'react';

import Table from '../GenericTable';
import BadgeIcon from './BadgeIcon';
import { setDateFormat } from '../../utils/Utils';

const CategoriesTable = ({
  dataSource,
  selectedData,
  setSelectedData,
  paginationInfo,
  onPageChange,
  onHandleEdit,
  setCreateMode,
  dataInDB,
  sortingTable,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const columns = [
    {
      key: 'Icon',
      component: 'Icon',
    },
    {
      key: 'Title',
      orderBy: 'name',
      component: 'Title',
    },
    {
      key: 'Description',
      orderBy: 'description',
      component: 'Description',
    },
    {
      key: 'LastModified',
      orderBy: 'updated_at',
      component: 'Last modified',
    },
    {
      key: 'Status',
      orderBy: 'status',
      component: 'Status',
    },
  ];

  const data = dataSource.map((item) => ({
    ...item,
    dataRow: [
      {
        key: 'Icon',
        component: (
          <span>
            <BadgeIcon badgeName={item.badge_url} />
          </span>
        ),
      },
      {
        key: 'Title',
        component: <span>{item.name}</span>,
      },
      {
        key: 'Description',
        component: <span>{item.description}</span>,
      },
      {
        key: 'Date',
        component: <span>{setDateFormat(item.updatedAt)}</span>,
      },
      {
        key: 'Status',
        component: <span className="text-capitalize">{item.status}</span>,
      },
    ],
  }));

  return (
    <div className="table-responsive-md datatable-custom">
      <Table
        checkbox
        onClick={onHandleEdit}
        columns={columns}
        data={data}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        paginationInfo={paginationInfo}
        onPageChange={onPageChange}
        toggle={setCreateMode}
        emptyDataText="No badges available yet."
        title="badge"
        dataInDB={dataInDB}
        sortingTable={sortingTable}
      />
    </div>
  );
};

export default CategoriesTable;
