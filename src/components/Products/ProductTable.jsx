import React, { useState } from 'react';

import Table from '../GenericTable';
import { formatNumber, setDateFormat } from '../../utils/Utils';

const ProductTable = ({
  data = [],
  paginationInfo,
  onPageChange,
  handleEdit,
  selectedProducts,
  setSelectedProducts,
  onClickRow,
  dataInDB,
  onCreate,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const columns = [
    {
      key: 'Code',
      component: 'Code',
    },
    {
      key: 'Name',
      component: 'Name',
    },
    {
      key: 'Price',
      component: 'Price',
    },
    {
      key: 'lastModified',
      component: 'Last Modified',
    },
    {
      key: 'Tenant',
      component: 'Tenant',
      onlyAdmin: true,
    },
  ];

  const rows = data.map((item) => {
    const { code, name, price, updatedAt, tenant } = item;
    const response = {
      ...item,
      dataRow: [
        {
          key: 'code',
          component: <span>{code}</span>,
        },
        {
          key: 'name',
          component: (
            <span className="d-inline-block text-truncate mw-fix-200">
              {name}
            </span>
          ),
        },
        {
          key: 'price',
          component: (
            <span className="text-capitalize">
              {formatNumber(price, 2, 0, false)}
            </span>
          ),
        },
        {
          key: 'lastModified',
          component: <span>{setDateFormat(updatedAt)}</span>,
        },
        {
          key: 'tenant',
          onlyAdmin: true,
          component: <span className="text-capitalize">{tenant?.name}</span>,
        },
      ],
    };
    return response;
  });
  return (
    <Table
      checkbox
      selectedData={selectedProducts}
      setSelectedData={setSelectedProducts}
      selectAll={selectAll}
      setSelectAll={setSelectAll}
      columns={columns}
      data={rows}
      paginationInfo={paginationInfo}
      onPageChange={onPageChange}
      onHandleEdit={handleEdit}
      onClick={onClickRow}
      dataInDB={dataInDB}
      toggle={onCreate}
      title="product"
      emptyDataText="No products available yet."
    />
  );
};

export default ProductTable;
