import React, { useState } from 'react';

import Table from '../GenericTable';
import { isToFixedNoRound } from '../../utils/Utils';
import { Link } from 'react-router-dom';
import routes from '../../utils/routes.json';

const DealTableModal = ({
  data = [],
  paginationInfo,
  onPageChange,
  handleEdit,
  selectedCourses,
  setSelectedCourses,
  onClickRow,
  dataInDB,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const columns = [
    {
      key: 'title',
      component: 'Title',
    },
    {
      key: 'value',
      component: 'value',
    },
    {
      key: 'organization',
      component: 'organization',
    },
    {
      key: 'contactPerson',
      component: 'Contact Person',
    },
  ];

  const rows = data.map((item) => {
    const { id, name, amount, organization, contact } = item;
    const response = {
      ...item,
      dataRow: [
        {
          key: 'title',
          component: (
            <Link to={`${routes.dealsPipeline}/${id}`} className="text-block">
              {name}
            </Link>
          ),
        },
        {
          key: 'value',
          component: <span>{isToFixedNoRound(amount, 2)}</span>,
        },
        {
          key: 'organization',
          component: (
            <Link
              to={`${routes.contacts}/${organization?.id}/organizations/profile`}
              className="text-block"
            >
              {organization?.name}
            </Link>
          ),
        },
        {
          key: 'contactPerson',
          component: (
            <Link
              to={`${routes.contacts}/${contact?.id}/profile`}
              className="text-block"
            >
              {contact?.first_name} {contact?.last_name}
            </Link>
          ),
        },
      ],
    };
    return response;
  });

  return (
    <Table
      selectedData={selectedCourses}
      setSelectedData={setSelectedCourses}
      selectAll={selectAll}
      setSelectAll={setSelectAll}
      columns={columns}
      data={rows}
      paginationInfo={paginationInfo}
      onPageChange={onPageChange}
      onHandleEdit={handleEdit}
      onClick={onClickRow}
      emptyDataText="No deals available yet."
      title="Deals"
      dataInDB={dataInDB}
    />
  );
};

export default DealTableModal;
