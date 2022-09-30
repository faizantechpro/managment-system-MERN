import React from 'react';
import BaseBlock from './BaseBlock';

const TextBlock = ({ data, text, partner, showAdd, direction = '' }) => {
  return (
    <BaseBlock
      showAdd={showAdd}
      partner={partner}
      direction={direction}
      dataBlock={
        <>
          <h1 className="text-success mb-0 font-size-3em font-weight-bold">
            {data.value}
          </h1>
          <p className="font-size-xs mb-0 font-weight-semi-bold">{data.text}</p>
        </>
      }
      textBlock={<p className="mb-0">{text}</p>}
    />
  );
};
export default TextBlock;
