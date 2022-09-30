import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import moment from 'moment';
import React from 'react';
import { FormGroup, Label } from 'reactstrap';

const IdfDatePicker = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  format = 'YYYY-MM-DD',
}) => {
  const onHandleChange = (e) => {
    if (e?.value) {
      onChange({
        target: {
          value: moment(e.value).format(format),
          name: name,
          id: name,
        },
      });
    }
  };

  return (
    <FormGroup>
      <Label>{label}</Label>
      <DatePickerComponent
        id={name}
        name={name}
        format="MMM dd, yyyy"
        className="calendar-activity"
        placeholder={placeholder}
        openOnFocus={true}
        value={value[name] || ''}
        onChange={onHandleChange}
      />
    </FormGroup>
  );
};

export default IdfDatePicker;
