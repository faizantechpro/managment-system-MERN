import { Form } from 'react-bootstrap';
import { CardLabel } from '../layouts/ActivityLayout';

const DateInput = ({
  onChange,
  id,
  value,
  name,
  placeholder,
  label,
  size,
  labelSize,
  containerClassName,
  formClassName,
  className,
  min,
  max,
}) => {
  return (
    <CardLabel
      controlId={id}
      label={label}
      labelSize={labelSize}
      className={className}
      containerClassName={containerClassName}
      formClassName={formClassName}
    >
      <Form.Control
        min={min}
        max={max}
        xs={labelSize === `full` ? 12 : ''}
        type="date"
        onChange={onChange}
        value={value}
        id={id}
        name={name}
        placeholder={placeholder}
        size={size || 'sm'}
      />
    </CardLabel>
  );
};

export default DateInput;
