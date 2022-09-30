import React, { useState } from 'react';

import Table from '../GenericTable';
import { setDateFormat } from '../../utils/Utils';
import { QUIZZES_COLUMNS } from './QuizzesTable.constants';

const QuizzesTable = ({
  dataSource,
  selectedData,
  setSelectedData,
  paginationInfo,
  onPageChange,
  onHandleEdit,
  onCreateQuiz,
  dataInDB,
  sortingTable,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const data = dataSource.map((item) => ({
    ...item,
    dataRow: [
      {
        key: 'Title',
        component: <span>{item.intro}</span>,
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
        columns={QUIZZES_COLUMNS}
        data={data}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        paginationInfo={paginationInfo}
        onPageChange={onPageChange}
        toggle={onCreateQuiz}
        emptyDataText="No Quizzes available yet."
        title="Quiz"
        dataInDB={dataInDB}
        sortingTable={sortingTable}
      />
    </div>
  );
};

export default QuizzesTable;
