import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// will use this component and customize it more as we are integrating throughout app
const ReactDatepicker = ({
  onChange,
  id,
  value,
  name,
  placeholder,
  className,
  minDate,
  format,
}) => {
  return (
    <DatePicker
      id={id}
      name={name}
      dateFormat={format}
      minDate={minDate}
      todayButton="Today"
      selected={value}
      popperClassName="idf-date"
      className={className}
      placeholderText={placeholder}
      onChange={onChange}
    />
  );
};

export default ReactDatepicker;
