import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Table from '../GenericTable';
import { isToFixedNoRound, setDateFormat } from '../../utils/Utils';
import routes from '../../utils/routes.json';
import IdfOwnersHeader from '../idfComponents/idfAdditionalOwners/IdfOwnersHeader';
import Loading from '../Loading';
import userService from '../../services/user.service';

const DealTable = ({
  data = [],
  paginationInfo,
  onPageChange,
  handleEdit,
  selectedCourses,
  setSelectedCourses,
  onClickRow,
  service,
  showLoading,
  onAddDeal,
  dataInDB,
  sortingTable,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [me, setMe] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const me = await userService
      .getUserInfo()
      .catch((err) => console.error(err));

    setMe(me);
  };

  const columns = [
    {
      key: 'title',
      orderBy: 'name',
      component: 'Title',
    },
    {
      key: 'value',
      orderBy: 'amount',
      component: 'value',
    },
    {
      key: 'organization',
      orderBy: 'organization',
      component: 'organization',
    },
    {
      key: 'contactPerson',
      orderBy: 'contact',
      component: 'Contact Person',
    },
    {
      key: 'expectedCloseDate',
      orderBy: 'date_closed',
      component: 'Expected Close Date',
    },
    {
      key: 'owner',
      orderBy: 'owner',
      component: 'Owner(s)',
    },
  ];

  const rows = data.map((item) => {
    const {
      id,
      name,
      amount,
      organization,
      contact,
      date_closed,
      assigned_user,
      owners,
    } = item;

    const isPrincipalOwner =
      me && item
        ? me?.roleInfo?.admin_access || assigned_user?.id === me?.id
        : false;

    const response = {
      ...item,
      dataRow: [
        {
          key: 'title',
          component: (
            <Link
              to={`${routes.dealsPipeline}/${item.id}`}
              className="text-black fw-bold"
            >
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
          component: <span>{organization?.name}</span>,
        },
        {
          key: 'contactPerson',
          component: (
            <span>
              {contact?.first_name} {contact?.last_name}
            </span>
          ),
        },
        {
          key: 'expectedCloseDate',
          component: (
            <span>{date_closed ? setDateFormat(date_closed) : ''}</span>
          ),
        },
        {
          key: 'owner',
          component: (
            <IdfOwnersHeader
              mainOwner={assigned_user}
              service={service}
              serviceId={id}
              listOwners={owners}
              defaultSize="xs"
              maxOwners={3}
              isprincipalowner={isPrincipalOwner}
              small
            />
          ),
        },
      ],
    };
    return response;
  });

  return (
    <div className="table-responsive-md datatable-custom">
      {showLoading ? (
        <Loading />
      ) : (
        <Table
          usePagination
          selectedData={selectedCourses}
          setSelectedData={setSelectedCourses}
          selectAll={selectAll}
          setSelectAll={setSelectAll}
          columns={columns}
          data={rows}
          onPageChange={onPageChange}
          onHandleEdit={handleEdit}
          onClick={onClickRow}
          paginationInfo={paginationInfo}
          toggle={onAddDeal}
          emptyDataText="No deals available yet."
          title="deal"
          dataInDB={dataInDB}
          sortingTable={sortingTable}
        />
      )}
    </div>
  );
};

export default DealTable;
