import { Row } from 'react-bootstrap';

const Item = ({ children, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={`p-2 item-btn rounded w-100 tr-hover cursor-pointer ${className}`}
    >
      <Row className="item-container d-flex align-items-center" noGutters>
        {children}
      </Row>
    </div>
  );
};

export default Item;
