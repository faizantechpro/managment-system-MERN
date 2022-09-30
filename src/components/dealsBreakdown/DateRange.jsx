import React, { useState, useEffect } from 'react';

import { endOfDay, startOfDay, addMonths } from 'date-fns';

const defineds = {
  startOfLast30Days: endOfDay(addMonths(new Date(), -1)),
  endOfLast30Days: startOfDay(new Date()),

  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
};

const DateRange = ({ setRange, disableDefaultRange }) => {
  const [dateRange] = useState([
    {
      startDate: !disableDefaultRange ? defineds.startOfLast30Days : undefined,
      endDate: !disableDefaultRange
        ? defineds.endOfLast30Days
        : defineds.endOfToday,
      key: 'selection',
    },
  ]);

  const applyChanges = () => {
    setRange({
      startDate: dateRange[0].startDate,
      endDate: dateRange[0].endDate,
    });
  };

  useEffect(() => {
    applyChanges();
  }, []);

  return <div />;
};

DateRange.defaultProps = {
  disablePastDate: false,
  disableDefaultRange: false,
};

export default DateRange;
