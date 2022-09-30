import { Form } from 'react-bootstrap';
import { CardLabel } from '../layouts/ActivityLayout';

const TextInput = ({
  onChange,
  disabled,
  id,
  value,
  name,
  placeholder,
  label,
  size,
  labelSize,
  containerClassName,
  formClassName,
  inputClassName,
  className,
  readOnly,
  pattern,
  max,
  min,
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
        max={max}
        min={min}
        pattern={pattern}
        className={inputClassName}
        xs={labelSize === `full` ? 12 : ''}
        disabled={disabled}
        type="text"
        onChange={onChange}
        value={value}
        id={id}
        name={name}
        placeholder={placeholder}
        size={size || 'sm'}
        readOnly={readOnly}
      />
    </CardLabel>
  );
};

export default TextInput;
