import { Col } from 'react-bootstrap';

const ItemAvatar = ({ children, className }) => {
  return (
    <Col className={`item-avatar rounded-circle ${className}`}>{children}</Col>
  );
};

export default ItemAvatar;
