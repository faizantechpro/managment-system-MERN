import React from 'react';
import TableSelectedCount from '../prospecting/v2/common/TableSelectedCount';

const LayoutHead = ({
  filter,
  onHandleCreate,
  buttonLabel,
  selectedData = [],
  onDelete,
  allRegister,
  children,
  orientationDelete,
  labelButtonDelete = 'Delete',
  dataInDB,
  onClear,
}) => {
  return (
    <div className="w-100 d-flex mb-2">
      {filter && filter()}
      <div className="ml-auto d-flex align-items-center">
        {selectedData.length > 0 && (
          <>
            <TableSelectedCount
              list={selectedData}
              btnClick={onDelete.bind(null, selectedData)}
              containerPadding="mr-2"
              btnClass="btn-sm"
              btnIcon="delete"
              onClear={onClear}
              btnLabel={labelButtonDelete}
              btnColor="outline-danger"
            />
          </>
        )}

        {!orientationDelete && <span className="mr-2">{allRegister}</span>}
        {children}
        {orientationDelete && <span className="mr-2">{allRegister}</span>}

        <div className="ml-2">
          {dataInDB && (
            <button
              className="btn btn-primary btn-sm"
              data-toggle="modal"
              onClick={onHandleCreate}
            >
              <span className="material-icons-outlined">add</span>
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutHead;
