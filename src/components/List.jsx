import { Col } from 'react-bootstrap';

const List = ({ children, className }) => {
  return (
    <Col xs={12} className={`px-0 ${className}`}>
      {children}
    </Col>
  );
};

export default List;
