import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useState, useEffect } from 'react';
import moment from 'moment';
import {
  TimePickerComponent,
  DatePickerComponent,
} from '@syncfusion/ej2-react-calendars';

import './DatePickerInput.css';
import { CardLabel } from '../../layouts/ActivityLayout';
import { setDateFormat } from '../../../utils/Utils';

const DateRangeInput = ({
  label,
  labelSize,
  setStartDate,
  setEndDate,
  steps,
  reset,
  id,
  initialStartDate = '',
}) => {
  const formatHHMM = 'hh:mm A';
  const formatYYYYMMDD = 'YYYY-MM-DD';

  const currentDate = moment(new Date()).format(formatYYYYMMDD);

  const [startTime, setStartTime] = useState();
  const [_startDate, _setStartDate] = useState();
  const [endTime, setEndTime] = useState();
  const [_endDate, _setEndDate] = useState();

  useEffect(() => {
    if (_startDate && startTime && endTime) {
      setStartDate(`${_startDate} ${startTime}`);
    }

    if (_endDate && endTime) {
      setEndDate(`${_endDate} ${endTime}`);
    }
  }, [_startDate, startTime, _endDate, endTime]);

  useEffect(() => {
    if (_startDate) {
      _setEndDate(_startDate);

      const ceilTime = Math.ceil(moment().format('mm') / 5) * 5;

      if (startTime)
        setStartTime(moment().set('minute', ceilTime).format(formatHHMM));

      if (endTime)
        setEndTime(moment().set('minute', ceilTime).format(formatHHMM));
    }
  }, [_startDate]);

  useEffect(() => {
    setStartTime('');
    _setStartDate('');

    setEndTime('');
    _setEndDate('');
  }, [reset]);

  useEffect(() => {
    if (initialStartDate !== '') {
      const elStartTime = setDateFormat(initialStartDate, formatHHMM);

      const elStartDate = setDateFormat(initialStartDate, formatYYYYMMDD);

      setStartTime(elStartTime);
      _setStartDate(elStartDate);

      setEndTime(elStartTime);
      _setEndDate(elStartDate);
    }
    datePickerChange();
  }, [initialStartDate]);

  const datePickerChange = (e, focus) => {
    const value = focus ? e?.value : e?.target?.value;
    _setStartDate(moment(value).format(formatYYYYMMDD));
  };

  const timePickerChange = (e, name) => {
    const callbackFunction = {
      startTime: setStartTime,
      endTime: setEndTime,
    };

    callbackFunction[name](moment(e?.value).format(formatHHMM));
  };

  return (
    <CardLabel label={label} labelSize={labelSize}>
      <div className={`input-time position-relative ml-1 pl-1`}>
        <DatePickerComponent
          id={`start-date-${id}`}
          format="yyyy-MM-dd"
          className="calendar-activity"
          placeholder="Select Date"
          openOnFocus={true}
          value={_startDate || currentDate}
          onFocus={(e) => datePickerChange(e, true)}
          onBlur={datePickerChange}
        />
        <TimePickerComponent
          id={`start-time-${id}`}
          cssClass="e-custom-style ml-1"
          openOnFocus={true}
          value={startTime}
          format="hh:mm a"
          placeholder="Select Time"
          onChange={(e) => timePickerChange(e, 'startTime')}
          step={steps}
        />

        <TimePickerComponent
          id={`end-time-${id}`}
          cssClass="e-custom-style mx-1"
          openOnFocus={true}
          value={endTime}
          format="hh:mm a"
          placeholder="Select Time"
          onChange={(e) => timePickerChange(e, 'endTime')}
          step={steps}
        />

        <DatePickerComponent
          id={`end-date-${id}`}
          format="yyyy-MM-dd"
          className="calendar-activity"
          placeholder="Select Date"
          openOnFocus={true}
          value={_endDate || currentDate}
          onFocus={datePickerChange}
          onBlur={datePickerChange}
        />
      </div>
    </CardLabel>
  );
};

export default DateRangeInput;
