import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const IconText = ({ count, ...rest }) => {
  const [lookupCount] = useState(Array(count).fill(0));
  const Box = ({ children }) => {
    return <div className="w-100 flex-grow-1">{children}</div>;
  };
  const SkeletonTemplate = () => {
    return (
      <div className="w-100 my-1" {...rest}>
        <div className="d-flex align-items-center">
          <Skeleton
            circle
            className="rounded-circle mr-1"
            style={{ height: 18, width: 18 }}
          />
          <Box>
            <Skeleton
              count={1}
              width={80}
              className="rounded w-100"
              style={{ height: 18 }}
            />
          </Box>
        </div>
      </div>
    );
  };
  return (
    <div>
      {lookupCount.map((_, index) => (
        <SkeletonTemplate key={index} />
      ))}
    </div>
  );
};

export default IconText;
