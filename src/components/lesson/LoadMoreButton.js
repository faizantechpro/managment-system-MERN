import React from 'react';
import ButtonIcon from '../commons/ButtonIcon';

// load more button component to work like pagination, this is being used in training UIs
const LoadMoreButton = ({
  list,
  btnText = 'Load more',
  pagination,
  onClick,
  loading,
}) => {
  return (
    <>
      {list.length > 0 &&
        list.length < pagination?.count &&
        pagination?.totalPages > 1 && (
          <div className="mt-2 mb-4 text-center">
            <ButtonIcon
              classnames="border-0 min-w-250"
              loading={loading}
              label={btnText}
              onclick={onClick}
            />
          </div>
        )}
    </>
  );
};

export default LoadMoreButton;
