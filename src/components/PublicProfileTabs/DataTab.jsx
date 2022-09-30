import React, { useState } from 'react';
import CustomReport from '../peopleProfile/contentFeed/CustomReport';
import { defaultReportBlocks } from '../reportbuilder/constants/reportBuilderConstants';

const DataTabe = () => {
  const [blocks, setBlocks] = useState([...defaultReportBlocks]);
  return (
    <>
      <CustomReport blocks={blocks} setBlocks={setBlocks} />
    </>
  );
};

export default DataTabe;
