import React from 'react';

import Table from '../GenericTable';
import MaterialIcon from '../commons/MaterialIcon';
import CategoryPartnerLogo from '../lesson/CategoryPartnerLogo';
import PopoverWrapper from '../commons/PopoverWrapper';
import { setDateFormat } from '../../utils/Utils';
import TableActions from '../commons/TableActions';
import { useProfileContext } from '../../contexts/profileContext';

const CategoriesTable = ({
  dataSource = [],
  paginationInfo,
  onPageChange,
  handleEdit,
  handleDelete,
  selectedCategories,
  setSelectedCategories,
  setShowCreateModal,
  dataInDB,
  sortingTable,
  selectAll,
  setSelectAll,
}) => {
  const { profileInfo } = useProfileContext();
  const roleInfo = profileInfo?.roleInfo;
  const isAdmin = roleInfo?.admin_access;
  const lockedClick = (row) => {
    // TODO locked action
  };
  const columns = [
    {
      key: 'Title',
      orderBy: 'title',
      component: 'Name',
    },
    {
      key: 'Lessons',
      orderBy: 'totalLessons',
      component: 'Lessons',
    },
    {
      key: 'Courses',
      orderBy: 'totalCourses',
      component: 'Courses',
    },
    {
      key: 'Last Modified',
      orderBy: 'updated_at',
      component: 'Last Modified',
    },
    {
      key: 'owner',
      orderBy: '',
      component: '',
    },
  ];

  const CategoryTitle = ({ category }) => {
    return (
      <div className="d-inline-flex align-items-center">
        <span>{category.title}</span>
        {category.description && (
          <PopoverWrapper
            position="left"
            hoverElementStyle={'py-0 text-gray-900'}
            template={
              <div className="fs-7">
                {/* <h6 className="font-weight-semi-bold my-1">Description</h6> */}
                <p
                  className="mb-0 text-wrap text-black font-weight-normal "
                  style={{ width: '200px' }}
                >
                  {category.description}
                </p>
              </div>
            }
          >
            <MaterialIcon icon="info" clazz="ml-1" />
          </PopoverWrapper>
        )}
        {category.logo && (
          <PopoverWrapper
            position="left"
            hoverElementStyle={'py-0 text-gray-900'}
            applyWidth={false}
            template={
              <div className="fs-7">
                <h6 className="font-weight-semi-bold my-1">Partner Logo</h6>
                <div className="d-flex align-items-center p-1">
                  <CategoryPartnerLogo
                    categoryInfo={category}
                    imageStyle={'ml-0'}
                  />
                </div>
              </div>
            }
          >
            <MaterialIcon icon="image" clazz="ml-1" />
          </PopoverWrapper>
        )}
      </div>
    );
  };

  const tableActions = [
    {
      id: 1,
      title: 'Edit',
      icon: 'edit',
      onClick: handleEdit,
    },
    {
      id: 2,
      title: 'Delete',
      icon: 'delete',
      onClick: handleDelete,
      style: 'ml-3 text-danger',
    },
  ];
  const tableActionsLock = [
    {
      id: 1,
      title: 'Locked',
      icon: 'lock',
      onClick: lockedClick,
    },
  ];
  const data = dataSource.map((item) => ({
    ...item,
    dataRow: [
      {
        key: 'title',
        component: <CategoryTitle category={item} />,
      },
      {
        key: 'totalLessons',
        component: <span className="text-wrap">{item.totalLessons || 0}</span>,
      },
      {
        key: 'totalCourses',
        component: <span className="text-wrap">{item.totalCourses || 0}</span>,
      },
      {
        key: 'updated_at',
        component: <span>{setDateFormat(item.updated_at)}</span>,
      },
      {
        key: '',
        component: (
          <TableActions
            item={item}
            actions={
              isAdmin
                ? tableActions
                : item.isPublic
                ? tableActionsLock
                : tableActions
            }
          />
        ),
      },
    ],
  }));

  return (
    <div className="table-responsive-md datatable-custom">
      <Table
        checkbox={isAdmin}
        selectedData={selectedCategories}
        setSelectedData={setSelectedCategories}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        columns={columns}
        data={data}
        paginationInfo={paginationInfo}
        onPageChange={onPageChange}
        toggle={() => setShowCreateModal(true)}
        emptyDataText="No categories."
        title="category"
        onClick={handleEdit}
        dataInDB={dataInDB}
        noDataInDbValidation={true}
        sortingTable={sortingTable}
      />
    </div>
  );
};

export default CategoriesTable;
