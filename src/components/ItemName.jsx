import { Col } from 'react-bootstrap';

const ItemName = (itemUserProps) => {
  return (
    <Col
      className={`item-user text-capitalize ${
        itemUserProps.bigmx ? 'mx-3' : 'mx-0'
      } w-100`}
      onClick={itemUserProps.onClick}
    >
      <div className="d-flex align-items-center">
        {itemUserProps.itemIcon &&
          itemUserProps.showIcon &&
          itemUserProps.name && (
            <span className="material-icons-outlined m-1 ">
              {itemUserProps.itemIcon}
            </span>
          )}
        <h5 className="mb-0 w-100">{itemUserProps.name}</h5>
      </div>
    </Col>
  );
};

export default ItemName;
