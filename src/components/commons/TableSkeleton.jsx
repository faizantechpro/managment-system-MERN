import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const TableSkeletonColumn = () => {
  return (
    <td>
      <Skeleton height="5" />
    </td>
  );
};
const TableSkeletonRow = ({ children }) => {
  return <tr>{children}</tr>;
};

const TableSkeleton = ({ rows, cols }) => {
  const [rowCount] = useState(Array(rows).fill(0));
  const [colsCount] = useState(Array(cols).fill(0));

  return (
    <div className="overflow-table">
      <table
        className={`table table-lg table-borderless table-thead-bordered table-nowrap table-align-middle card-table dataTable no-footer`}
        role="grid"
      >
        <tbody>
          {rowCount.map((rr, rIndex) => (
            <TableSkeletonRow key={rIndex}>
              {colsCount.map((cc, cIndex) => (
                <TableSkeletonColumn key={cIndex} />
              ))}
            </TableSkeletonRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
