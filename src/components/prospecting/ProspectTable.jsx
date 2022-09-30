import React, { useState } from 'react';

import Table from '../GenericTable';
import { columnsTableProspecting } from './constants';
import constantsString from '../../utils/stringConstants.json';
import routes from '../../utils/routes.json';

const constants = constantsString.deals.prospecting;

const ProspectTable = ({
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
    const { first_name, last_name, city, state, company, title, email, id } =
      item;

    const response = {
      ...item,
      dataRow: [
        {
          key: 'Company',
          component: (
            <a
              href={`${routes.prospects}/company/${company?.id}`}
              className="text-dark"
            >
              <span className="text-capitalize fw-bold">
                {company?.company_name}
              </span>
            </a>
          ),
        },
        {
          key: 'contact',
          component: (
            <a href={`${routes.prospects}/contact/${id}`} className="text-dark">
              <span className="text-capitalize">{`${first_name} ${last_name}`}</span>
            </a>
          ),
        },
        {
          key: 'Title',
          component: <span>{title}</span>,
        },
        {
          key: 'Email',
          component: <span>{email}</span>,
        },
        {
          key: 'Phone',
          component: <span>{company?.phone_number}</span>,
        },
        {
          key: 'Contact Location',
          component: (
            <span>
              {city}, {state}
            </span>
          ),
        },
        {
          key: 'Location',
          component: (
            <span>
              {company?.city}, {company?.state}
            </span>
          ),
        },
        {
          key: 'Industry',
          component: <span>{company?.industry}</span>,
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
        columns={columnsTableProspecting}
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

export default ProspectTable;
