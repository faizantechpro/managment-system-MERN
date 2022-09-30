import { useEffect, useState } from 'react';

import organizationService from '../../services/organization.service';
import { paginationDefault } from '../../utils/constants';
import { changePaginationPage } from '../../views/Deals/contacts/utils';
import Avatar from '../Avatar';
import Table from '../GenericTable';

export const bankTeamColumns = [
  {
    key: 'name',
    component: <span>Name</span>,
  },
  {
    key: 'title',
    label: 'title',
    component: <span>Title</span>,
  },
  {
    key: 'phone',
    label: 'phone',
    component: <span>Phone</span>,
  },
];

const BankTeamTable = ({ organizationId }) => {
  const [bankTeamData, setBankTeamData] = useState([]);
  const [pagination, setPagination] = useState(paginationDefault);
  const [paginationPage, setPaginationPage] = useState(paginationDefault);

  useEffect(() => {
    onGetOwners();
  }, [organizationId, paginationPage]);

  const onGetOwners = async () => {
    const resp = await organizationService
      .getContactsByOrganizationId(organizationId, {
        page: paginationPage.page,
        limit: 5,
      })
      .catch((err) => console.log(err));

    const { data, pagination } = resp || {};

    setBankTeamData(data?.contacts);
    setPagination(pagination);
  };

  const data = bankTeamData?.map((member) => ({
    key: member.user_id,
    ...member,
    dataRow: [
      {
        key: 'name',
        component: (
          <div className="d-flex align-items-center">
            <Avatar user={member} />
            <div className="ml-2">
              <p className="m-0 font-weight-bold">{`${member?.first_name} ${member?.last_name}`}</p>
              <p className="m-0">{member?.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'title',
        component: <span>{member?.title}</span>,
      },
      {
        key: 'phone',
        component: (
          <span>
            {member?.phone_work || member?.phone_home || member?.phone_mobile}
          </span>
        ),
      },
    ],
  }));

  return (
    <Table
      columns={bankTeamColumns}
      data={data}
      onPageChange={(newPage) =>
        changePaginationPage(newPage, setPaginationPage)
      }
      paginationInfo={pagination}
      className="td-table"
      noDataInDbValidation={true}
    />
  );
};

export default BankTeamTable;
