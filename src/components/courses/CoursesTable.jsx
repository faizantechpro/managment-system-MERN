import React from 'react';

import Table from '../GenericTable';
import { setDateFormat } from '../../utils/Utils';
import StatusLabel from '../commons/StatusLabel';
import TableActions from '../commons/TableActions';
import PopoverWrapper from '../commons/PopoverWrapper';
import MaterialIcon from '../commons/MaterialIcon';
import { useProfileContext } from '../../contexts/profileContext';
const CoursesTable = ({
  data = [],
  paginationInfo,
  onPageChange,
  selectedCourses,
  setSelectedCourses,
  onClickRow,
  setCreate,
  dataInDB,
  sortingTable,
  selectAll,
  setSelectAll,
  handleDelete,
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
      orderBy: 'name',
      component: 'Name',
    },
    {
      key: 'Lessons',
      orderBy: 'totalLessons',
      component: 'Lessons',
    },
    {
      key: 'lastModified',
      orderBy: 'updated_at',
      component: 'Last Modified',
    },
    {
      key: 'Status',
      orderBy: 'status',
      component: 'Status',
    },
    {
      key: 'owner',
      orderBy: '',
      component: '',
    },
  ];

  const tableActions = [
    {
      id: 1,
      title: 'Edit',
      icon: 'edit',
      onClick: onClickRow,
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
  const CourseTitle = ({ course }) => {
    return (
      <div className="d-inline-flex align-items-center">
        <span>{course.name}</span>
        {course.description && (
          <PopoverWrapper
            position="left"
            hoverElementStyle={'py-0 text-gray-900 w-25'}
            template={
              <div className="fs-7">
                {/* <h6 className="font-weight-semi-bold my-1">Description</h6> */}
                <p
                  className="mb-0 text-wrap text-black font-weight-normal"
                  style={{ minWidth: '200px' }}
                >
                  {course.description}
                </p>
              </div>
            }
          >
            <MaterialIcon icon="info" clazz="ml-1" />
          </PopoverWrapper>
        )}
      </div>
    );
  };

  const rows = data.map((item) => {
    const { name, totalLessons, status, updated_at } = item;
    const response = {
      ...item,
      dataRow: [
        {
          key: 'title',
          component: <CourseTitle course={item} />,
        },
        {
          key: 'Lessons',
          component: <span>{totalLessons || 0}</span>,
        },
        {
          key: 'lastModified',
          component: <span>{setDateFormat(updated_at)}</span>,
        },
        {
          key: 'Status',
          component: <StatusLabel status={status} />,
        },
        {
          key: '',
          component: (
            <TableActions
              item={{ ...item, title: name }}
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
    };
    return response;
  });
  return (
    <div className="table-responsive-md datatable-custom">
      <Table
        checkbox={isAdmin}
        selectedData={selectedCourses}
        setSelectedData={setSelectedCourses}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        columns={columns}
        data={rows}
        paginationInfo={paginationInfo}
        onPageChange={onPageChange}
        toggle={setCreate}
        emptyDataText="No courses."
        title="course"
        dataInDB={dataInDB}
        onClick={onClickRow}
        sortingTable={sortingTable}
      />
    </div>
  );
};

export default CoursesTable;
