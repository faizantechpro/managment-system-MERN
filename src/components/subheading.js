import { Row, Col } from 'reactstrap';

export default function SubHeading({ title }) {
  return (
    <Row>
      <Col className="mb-5">
        <h3 className="mb-0">{title}</h3>
      </Col>
    </Row>
  );
}
