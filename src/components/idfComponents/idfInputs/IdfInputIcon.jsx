import { Col, Container, Row } from 'react-bootstrap';

const IdfInputIcon = ({
  className,
  onChange,
  icon,
  placeholder,
  type,
  value,
}) => {
  return (
    <Container className={`form-control ${className}`}>
      <Row>
        <Col className="pr-0">
          <input
            className="border-0 font-size-sm w-100"
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
          />
        </Col>
        <Col className="border-0 col-auto">
          <i className="material-icons-outlined mr-1 w-100">{icon}</i>
        </Col>
      </Row>
    </Container>
  );
};

export default IdfInputIcon;
