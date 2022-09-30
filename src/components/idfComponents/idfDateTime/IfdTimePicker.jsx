import { TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import moment from 'moment';
import React from 'react';
import { FormGroup, Label } from 'reactstrap';

const IdfTimePicker = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  format = 'hh:mm A',
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
      <TimePickerComponent
        id={name}
        name={name}
        format={'hh:mm a'}
        cssClass="e-custom-style"
        placeholder={placeholder}
        openOnFocus={true}
        value={value[name] || ''}
        onChange={onHandleChange}
      />
    </FormGroup>
  );
};

export default IdfTimePicker;
