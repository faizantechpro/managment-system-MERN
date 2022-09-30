import React from 'react';
import { Card } from 'react-bootstrap';

import DealTable from '../../../components/deals/DealTable';

const DealList = ({
  allDeals,
  pagination,
  onPaginationChange,
  showLoading,
  service,
  onAddDeal,
  dataInDB,
  toggle,
  sortingTable,
}) => {
  return (
    <Card>
      <DealTable
        data={allDeals}
        paginationInfo={pagination}
        onPageChange={(page) => onPaginationChange(page)}
        service={service}
        showLoading={showLoading}
        onAddDeal={onAddDeal}
        dataInDB={dataInDB}
        sortingTable={sortingTable}
      />
    </Card>
  );
};

export default DealList;
