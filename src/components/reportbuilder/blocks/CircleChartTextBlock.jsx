import React from 'react';
import CircleChartBlock from './CircleChartBlock';
import BaseBlock from './BaseBlock';

const CircleChartTextBlock = ({
  data,
  text,
  partner,
  showAdd,
  options,
  direction = '',
}) => {
  return (
    <BaseBlock
      showAdd={showAdd}
      partner={partner}
      direction={direction}
      dataBlock={
        <CircleChartBlock
          text={data.data.data[0] + '%'}
          data={data}
          options={options}
        />
      }
      textBlock={<p className="mb-0">{text}</p>}
    />
  );
};
export default CircleChartTextBlock;
