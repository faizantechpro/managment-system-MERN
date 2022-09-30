import { CardFooter, Row, Col } from 'reactstrap';
import { Button } from 'react-bootstrap';

import Pagination from './Pagination';
import { useProfileContext } from '../contexts/profileContext';
import { NO_SEARCH_RESULTS } from '../utils/constants';
import React from 'react';
import NoDataFound from './commons/NoDataFound';

export default function Table({
  className,
  checkbox,
  columns,
  data,
  selectAll,
  setSelectAll,
  selectedData,
  setSelectedData,
  usePagination = true,
  paginationInfo,
  onPageChange,
  onHandleEdit,
  onClick,
  onClickCol,
  showLoading,
  componentAction,
  clickableCell,
  toggle,
  emptyDataText,
  title,
  dataInDB,
  noDataInDbValidation,
  sortingTable,
}) {
  const { profileInfo } = useProfileContext();
  const isAdmin = profileInfo?.roleInfo?.admin_access;

  const onCheck = () => {
    setSelectAll(!selectAll);
    setSelectedData(
      data?.length === selectedData?.length
        ? []
        : data?.map((user) => String(user.id))
    );
  };

  const onHandleSelect = (e, rowId) => {
    e.stopPropagation();

    const idsSelected = selectedData.slice();

    const exist = idsSelected.find((id) => id === rowId);

    if (exist) {
      const newIds = idsSelected.filter((id) => id !== rowId);
      setSelectAll(false);
      return setSelectedData(newIds);
    }

    idsSelected.push(rowId);

    setSelectedData(idsSelected);
  };

  const noData = () => {
    if (!dataInDB && !noDataInDbValidation) {
      return (
        <div className="d-flex justify-content-center align-items-center h-spinner">
          <div className="w-25 text-center">
            <p className="fs-6">{emptyDataText}</p>
            {toggle && (
              <Button variant="link" onClick={toggle}>
                {`Add your first ${title}`}
              </Button>
            )}
          </div>
        </div>
      );
    } else if (!data?.length && !showLoading) {
      const Title = () => {
        return (
          <div className="text-gray-search">
            {emptyDataText || NO_SEARCH_RESULTS}
          </div>
        );
      };
      return (
        <NoDataFound
          icon="manage_search"
          containerStyle="text-gray-search my-6 py-6"
          title={<Title />}
        />
      );
    }
  };

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <table
        id={`datatable-${title}`}
        className={`table table-lg table-hover table-borderless table-thead-bordered table-nowrap table-align-middle card-table dataTable no-footer ${
          className || ''
        }`}
        role="grid"
      >
        <thead className="thead-light">
          <tr role="row">
            {checkbox && (
              <th className="w-th-45 pr-0">
                <div className="custom-control custom-checkbox">
                  <input
                    id={`datatableCheckAll-${title}`}
                    type="checkbox"
                    className="custom-control-input"
                    onChange={onCheck}
                    checked={selectAll}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={`datatableCheckAll-${title}`}
                  ></label>
                </div>
              </th>
            )}
            {columns.map((column, i) => (
              <th
                key={`${column.key}-${i}`}
                className={`px-2 ${column.key !== 'owner' && 'sorting'}`}
                rowSpan="1"
                colSpan="1"
                style={{
                  width: column.width,
                  display: !column.onlyAdmin ? '' : isAdmin ? '' : 'none',
                }}
                onClick={() => sortingTable({ name: column.orderBy })}
              >
                {column.component}
              </th>
            ))}
            {onHandleEdit && (
              <th
                className="sorting_disabled w-0"
                rowSpan="1"
                colSpan="1"
                aria-label=""
              ></th>
            )}
          </tr>
        </thead>

        <tbody>
          {(dataInDB || noDataInDbValidation) &&
            data?.map((row) => {
              const checked = !selectedData
                ? false
                : selectedData.find(
                    (selected) => String(selected) === String(row.id)
                  ) || false;
              return (
                <tr
                  key={row.id}
                  role="row"
                  className={`odd ${
                    onClick || clickableCell ? 'tr-hover cursor-pointer' : ''
                  } ${checked ? 'bg-soft-primary' : ''}`}
                  onClick={() => (onClick ? onClick(row) : null)}
                >
                  {checkbox && (
                    <td className="pr-0">
                      <div
                        className="custom-control custom-checkbox"
                        onClick={(e) => onHandleSelect(e, String(row.id))}
                      >
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          checked={checked}
                          readOnly
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={row.id}
                        ></label>
                      </div>
                    </td>
                  )}
                  {row.dataRow.map((tdRow) => (
                    <>
                      <td
                        key={tdRow.key}
                        className="px-2"
                        onClick={() =>
                          onClickCol ? onClickCol(row, tdRow) : null
                        }
                        style={{
                          display: !tdRow.onlyAdmin
                            ? ''
                            : isAdmin
                            ? ''
                            : 'none',
                        }}
                      >
                        {tdRow.component}
                      </td>
                    </>
                  ))}
                  {onHandleEdit && (
                    <td>
                      <span
                        className="cursor-pointer"
                        onClick={() => onHandleEdit(row)}
                      >
                        {!componentAction && (
                          <i className="material-icons-outlined">edit</i>
                        )}

                        {componentAction}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>

      {noData()}

      {usePagination && dataInDB && (
        <CardFooter>
          <Row>
            <Col sm className="mb-2 mb-sm-0" />
            <Col className="col-sm-auto">
              <Pagination
                paginationInfo={paginationInfo}
                onPageChange={onPageChange}
              />
            </Col>
          </Row>
        </CardFooter>
      )}
    </div>
  );
}
