import { Form } from 'react-bootstrap';
import { FormGroup, Label } from 'reactstrap';

const IdfTextArea = ({ label, placeholder, name, value, onChange, rows }) => {
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Form.Control
        as="textarea"
        rows={rows || 3}
        onChange={onChange}
        value={value[name]}
        id={name}
        name={name}
        className="idftextarea"
        placeholder={placeholder}
      />
    </FormGroup>
  );
};

export default IdfTextArea;
