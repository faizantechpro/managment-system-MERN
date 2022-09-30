import React from 'react';
import ButtonFilterDropdown from '../commons/ButtonFilterDropdown';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import CategoryPartnerLogo from './CategoryPartnerLogo';
import MaterialIcon from '../commons/MaterialIcon';

const AscDescIconText = ({ icon, a, z }) => (
  <span>
    {a} <MaterialIcon icon={icon} /> {z}{' '}
  </span>
);

export const FILTER_OPTIONS_LIST = [
  { id: 1, key: 'latest', name: 'All Lessons' },
  { id: 2, key: 'favs', name: 'My Favorites' },
  {
    id: 3,
    key: 'asc',
    name: <AscDescIconText icon="arrow_right_alt" a="A" z="Z" />,
  },
  {
    id: 4,
    key: 'desc',
    name: <AscDescIconText icon="arrow_right_alt" a="Z" z="A" />,
  }, // will add draft option once its permission logic is added
];

const FAVORITES_FILTER_OPTIONS_LIST = [
  ...FILTER_OPTIONS_LIST.filter((item) => item.key !== 'favs'),
];

const StatsAndFilter = ({
  type,
  stats,
  lessonKey,
  courseKey,
  filterOptionSelected,
  handleFilterSelect,
  loading,
  categoryInfo = {},
}) => {
  const SkeletonLoader = () => {
    const h = 10;
    return (
      <div className="d-flex align-items-center">
        <SkeletonTheme color="#ccc" highlightColor="#eee">
          <Skeleton circle width={h} height={h} className="mr-1" />
          <Skeleton width={80} height={h} className="mr-1" />
          <Skeleton circle width={h} height={h} className="mr-1" />
          <Skeleton width={80} height={h} />
        </SkeletonTheme>
      </div>
    );
  };

  const Dot = () => {
    return (
      <>
        {stats?.[courseKey] &&
        stats?.[courseKey] > 0 &&
        stats?.[lessonKey] &&
        stats?.[lessonKey] > 0
          ? ' • '
          : ''}
      </>
    );
  };

  const StatsItem = ({ jsonKey, label }) => {
    return (
      <>
        {stats?.[jsonKey] && stats?.[jsonKey] > 0 ? (
          <>
            {' '}
            <span>
              {stats[jsonKey]} {label}
              {stats[jsonKey] > 1 ? 's' : ''}
            </span>
          </>
        ) : (
          ''
        )}
      </>
    );
  };

  const Stats = () => {
    return (
      <>
        <StatsItem jsonKey={courseKey} label="Course" />
        <Dot />
        <StatsItem jsonKey={lessonKey} label="Lesson" />
      </>
    );
  };

  return (
    <div className="ml-auto mb-2">
      <div className="d-flex align-items-center">
        <div className="mr-2">{loading ? <SkeletonLoader /> : <Stats />}</div>
        <ButtonFilterDropdown
          options={
            type === 'Favorites'
              ? FAVORITES_FILTER_OPTIONS_LIST
              : FILTER_OPTIONS_LIST
          }
          filterOptionSelected={filterOptionSelected}
          handleFilterSelect={handleFilterSelect}
        />
        {categoryInfo?.logo && (
          <div className="border-left h-100 min-h-100 ml-2">&nbsp;</div>
        )}
        <CategoryPartnerLogo
          categoryInfo={categoryInfo}
          imageStyle="height-30 ml-1"
        />
      </div>
    </div>
  );
};

export default StatsAndFilter;
