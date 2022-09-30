import React from 'react';

import Table from '../Table';
import Avatar from '../Avatar';
import { columns, EMPTY_LEADERBOARD } from '../../utils/constants';
import Loading from '../Loading';

function EmptyLeaderBoard({ loading }) {
  return (
    <>
      <h2 className="empty-leaderboard">
        {EMPTY_LEADERBOARD}

        {loading && <Loading />}
      </h2>
    </>
  );
}

function TableContent(props) {
  const { dataSource, paginationInfo, renderRank } = props;

  if (dataSource.length <= 0)
    return (
      <tr>
        <td colSpan="5">
          <EmptyLeaderBoard />
        </td>
      </tr>
    );

  return (
    <>
      {dataSource.map((dataItem, index) => (
        <tr key={dataItem.user_id}>
          <td>{renderRank(index + 1, paginationInfo)}</td>
          <td className="text-left">
            {dataItem.user && (
              <div className="d-flex align-items-center">
                <Avatar user={dataItem.user} />
                <div className="ml-3">
                  <span className="d-block h5 text-hover-primary mb-0">
                    {`${dataItem.user.first_name} ${dataItem.user.last_name}`}
                  </span>
                </div>
              </div>
            )}
          </td>
          <td>{dataItem.completedLessons}</td>
          <td>{dataItem.pendingLessons}</td>
          <td>{dataItem.pointsEarned}</td>
        </tr>
      ))}
    </>
  );
}

const LeaderboardTable = ({ dataSource, paginationInfo, onPageChange }) => {
  const renderRank = (index, info) => {
    let rank;
    if (info.page === 1) {
      rank = index;
    } else {
      rank = index + info.limit * (info.page - 1);
    }

    if (rank === 1) {
      return <span className="text-yellow rank-font-size">🥇</span>;
    } else if (rank === 2) {
      return <span className="text-secondary rank-font-size">🥈</span>;
    } else if (rank === 3) {
      return <span className="text-warning rank-font-size">🥉</span>;
    } else {
      return rank;
    }
  };

  return (
    <Table
      columns={columns}
      paginationInfo={paginationInfo}
      onPageChange={onPageChange}
    >
      <TableContent
        dataSource={dataSource}
        paginationInfo={paginationInfo}
        renderRank={renderRank}
      />
    </Table>
  );
};

export default LeaderboardTable;
