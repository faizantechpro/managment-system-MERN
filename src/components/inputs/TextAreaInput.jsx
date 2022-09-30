import { Col, Form } from 'react-bootstrap';
import { CardLabel } from '../layouts/ActivityLayout';

const TextAreaInput = ({
  onChange,
  value,
  name,
  placeholder,
  label,
  labelSize,
  inputClassName,
  rows,
  footerNote,
}) => {
  return (
    <CardLabel label={label} labelSize={labelSize}>
      <Col xs={labelSize === `full` ? 12 : ''} className={`p-0`}>
        <Form.Control
          as="textarea"
          rows={rows || 3}
          onChange={onChange}
          value={value}
          id={name}
          name={name}
          placeholder={placeholder}
          className={`${inputClassName}`}
        />
        {footerNote && (
          <span className={`text-area footer-note`}>{footerNote}</span>
        )}
      </Col>
    </CardLabel>
  );
};

export default TextAreaInput;
