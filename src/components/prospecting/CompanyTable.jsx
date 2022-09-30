import React, { useState } from 'react';

import Table from '../GenericTable';
import { columnsTableCompany } from './constants';
import constantsString from '../../utils/stringConstants.json';
import routes from '../../utils/routes.json';

const constants = constantsString.deals.prospecting;

const CompanyTable = ({
  data = [],
  checkbox = false,
  paginationInfo,
  onPageChange,
  selectedProspects,
  setSelectedProspects,
  onHandleEdit,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const rows = data.map((item) => {
    const { company_name, industry, city, state, phone_number, id } = item;

    const response = {
      ...item,
      dataRow: [
        {
          key: 'Name',
          component: (
            <a href={`${routes.prospects}/company/${id}`} className="text-dark">
              <span className="text-capitalize fw-bold">{company_name}</span>
            </a>
          ),
        },
        {
          key: 'Phone',
          component: <span>{phone_number}</span>,
        },
        {
          key: 'Location',
          component: (
            <span>
              {city}, {state}
            </span>
          ),
        },
        {
          key: 'Industry',
          component: <span>{industry}</span>,
        },
      ],
    };

    return response;
  });

  const componentAction = (
    <a className="btn btn-primary btn-sm btn-import">{constants.importLabel}</a>
  );

  return (
    <>
      <Table
        className={`prospect-table`}
        checkbox={checkbox}
        selectedData={selectedProspects}
        setSelectedData={setSelectedProspects}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        columns={columnsTableCompany}
        data={rows}
        paginationInfo={paginationInfo}
        onPageChange={onPageChange}
        onHandleEdit={onHandleEdit}
        componentAction={componentAction}
        noDataInDbValidation={true}
      />
    </>
  );
};

export default CompanyTable;
