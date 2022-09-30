import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonNewsLoader = ({
  count,
  circle = <Skeleton height={80} width={140} />,
  container,
  lineCount = 4,
}) => {
  const [lookupCount] = useState(Array(count).fill(0));
  const SkeletonTemplate = () => {
    const lineHeight = 13;
    return (
      <div className="d-flex align-items-center">
        <div className="text-left flex-grow-1 w-80">
          <Skeleton
            height={lineHeight}
            count={lineCount}
            className="d-block w-80 my-2"
          />
        </div>
        <div className="mr-3 ml-4">{circle}</div>
      </div>
    );
  };

  const WithContainer = (index) => {
    if (container) {
      return <SkeletonTemplate key={index} />;
    }

    return <SkeletonTemplate key={index} />;
  };

  return (
    <div>
      {lookupCount.map((_, index) => (
        <WithContainer key={index} />
      ))}
    </div>
  );
};

export default SkeletonNewsLoader;
