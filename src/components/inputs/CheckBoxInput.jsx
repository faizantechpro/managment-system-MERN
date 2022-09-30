import { Form } from 'react-bootstrap';
import { CardLabel } from '../layouts/ActivityLayout';

const CheckBoxInput = ({
  onChange,
  value,
  name,
  placeholder,
  label,
  size,
  labelSize,
  inputClassName,
  controlId,
  labelCheckBox,
}) => {
  return (
    <CardLabel
      label={label || false}
      labelSize={labelSize}
      controlId={controlId || ''}
    >
      <Form.Check
        type="checkbox"
        label={labelCheckBox}
        checked={value}
        onChange={onChange}
      />
    </CardLabel>
  );
};

export default CheckBoxInput;
