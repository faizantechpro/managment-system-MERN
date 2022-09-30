import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { Dropdown } from 'react-bootstrap';
import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from 'date-fns';

import { setDateFormat } from '../../utils/Utils';

const defineds = {
  startOfWeek: startOfWeek(new Date()),
  endOfWeek: endOfWeek(new Date()),

  startOfLastSevenDays: endOfDay(addDays(new Date(), -6)),
  endOfLastSevenDays: startOfDay(new Date()),

  startOfLast30Days: endOfDay(addMonths(new Date(), -1)),
  endOfLast30Days: startOfDay(new Date()),

  startOfLast90Days: endOfDay(addDays(new Date(), -90)),
  endOfLast90Days: startOfDay(new Date()),

  startOfLast180Days: endOfDay(addDays(new Date(), -180)),
  endOfLast180Days: startOfDay(new Date()),

  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),

  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),

  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),

  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
};

const DatePicker = ({
  range,
  setRange,
  disablePastDate,
  disableDefaultRange,
}) => {
  const [dateRange, setDateRange] = useState({
    startDate:
      range && range.startDate
        ? moment(range.startDate).utc().toDate()
        : !disableDefaultRange
        ? defineds.startOfLast30Days
        : undefined,
    endDate:
      range && range.endDate
        ? moment(range.endDate).utc().toDate()
        : !disableDefaultRange
        ? defineds.endOfLast30Days
        : defineds.endOfToday,
    key: 'selection',
  });

  const staticRanges = [
    {
      label: 'Today',
      range: () => ({
        startDate: defineds.startOfToday,
        endDate: defineds.endOfToday,
      }),
      isSelected: () =>
        isSameDay(dateRange.startDate, defineds.startOfToday) &&
        isSameDay(dateRange.endDate, defineds.endOfToday),
    },
    {
      label: 'Yesterday',
      range: () => ({
        startDate: defineds.startOfYesterday,
        endDate: defineds.endOfYesterday,
      }),
      isSelected: () =>
        isSameDay(dateRange.startDate, defineds.startOfYesterday) &&
        isSameDay(dateRange.endDate, defineds.endOfYesterday),
    },
    {
      label: 'Last 7 Days',
      range: () => ({
        startDate: defineds.startOfLastSevenDays,
        endDate: defineds.endOfLastSevenDays,
      }),
      isSelected: () =>
        isSameDay(dateRange.startDate, defineds.startOfLastSevenDays) &&
        isSameDay(dateRange.endDate, defineds.endOfLastSevenDays),
    },
    {
      label: 'Last 30 Days',
      range: () => ({
        startDate: defineds.startOfLast30Days,
        endDate: defineds.endOfLast30Days,
      }),
      isSelected: () =>
        isSameDay(dateRange.startDate, defineds.startOfLast30Days) &&
        isSameDay(dateRange.endDate, defineds.endOfLast30Days),
    },
    {
      label: 'Last 90 Days',
      range: () => ({
        startDate: defineds.startOfLast90Days,
        endDate: defineds.endOfLast90Days,
      }),
      isSelected: () =>
        isSameDay(dateRange.startDate, defineds.startOfLast90Days) &&
        isSameDay(dateRange.endDate, defineds.endOfLast90Days),
    },
    {
      label: 'Last 6 Months',
      range: () => ({
        startDate: defineds.startOfLast180Days,
        endDate: defineds.endOfLast180Days,
      }),
      isSelected: () =>
        isSameDay(dateRange.startDate, defineds.startOfLast180Days) &&
        isSameDay(dateRange.endDate, defineds.endOfLast180Days),
    },
    {
      label: 'This Month',
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfMonth,
      }),
      isSelected: () =>
        isSameDay(dateRange.startDate, defineds.startOfMonth) &&
        isSameDay(dateRange.endDate, defineds.endOfMonth),
    },
    {
      label: 'Last Month',
      range: () => ({
        startDate: defineds.startOfLastMonth,
        endDate: defineds.endOfLastMonth,
      }),
      isSelected: () =>
        isSameDay(dateRange.startDate, defineds.startOfLastMonth) &&
        isSameDay(dateRange.endDate, defineds.endOfLastMonth),
    },
  ];

  const applyChanges = () => {
    setRange({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
  };

  useEffect(() => {
    applyChanges();
  }, []);

  return (
    <Dropdown>
      <Dropdown.Toggle className="btn btn-sm btn-ghost-secondary dropdown-toggle border-0">
        <span className="material-icons-outlined">date_range</span>
        {range?.startDate && range?.endDate && (
          <span className="js-daterangepicker-predefined-preview ml-1">
            {setDateFormat(range?.startDate, 'MM/DD/YYYY')} -{' '}
            {setDateFormat(range?.endDate, 'MM/DD/YYYY')}
          </span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <div className="tests">
          <DateRangePicker
            showDateDisplay={false}
            staticRanges={staticRanges}
            inputRanges={[]}
            rangeColors={['#092ace']}
            ranges={[dateRange]}
            onChange={(item) => {
              setDateRange({
                ...item.selection,
                endDate: endOfDay(item.selection.endDate),
              });
            }}
            months={2}
            maxDate={disablePastDate ? new Date() : undefined}
            direction="horizontal"
          />
          <hr style={{ marginTop: 0, paddingTop: 0 }} />
          <div className="drp-buttons">
            <Dropdown.Item bsPrefix="deal">
              <button
                className="cancelBtn btn btn-sm btn-white mr-2"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  applyChanges();
                }}
                className="applyBtn btn btn-sm btn-primary"
                type="button"
              >
                Apply
              </button>
            </Dropdown.Item>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

DatePicker.defaultProps = {
  disablePastDate: false,
  disableDefaultRange: false,
};

export default DatePicker;
