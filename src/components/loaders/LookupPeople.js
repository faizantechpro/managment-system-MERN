import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import CardWrapper from './CardWrapper';

const SkeletonLookupPeople = ({
  count,
  circle = <Skeleton height={80} width={80} circle />,
  container,
  lineCount = 4,
}) => {
  const [lookupCount] = useState(Array(count).fill(0));
  const SkeletonTemplate = () => {
    const lineHeight = 13;
    return (
      <div className="d-flex align-items-center">
        <div className="mr-3">{circle}</div>
        <div className="text-left flex-grow-1 w-100">
          <Skeleton
            height={lineHeight}
            count={lineCount}
            className="d-block w-100 my-2"
          />
        </div>
      </div>
    );
  };

  const WithContainer = (index) => {
    if (container) {
      return (
        <CardWrapper>
          <SkeletonTemplate key={index} />
        </CardWrapper>
      );
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

export default SkeletonLookupPeople;
