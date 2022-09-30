import { Col, Row } from 'react-bootstrap';
import React from 'react';
import ButtonIcon from '../../commons/ButtonIcon';

const BaseBlock = ({
  dataBlock,
  textBlock,
  partner,
  direction = '',
  showAdd = false,
}) => {
  return (
    <>
      <Row
        className={`align-items-center position-relative ${direction} ${
          showAdd ? 'pt-4 pb-0' : ''
        } mb-2`}
      >
        {showAdd && (
          <ButtonIcon
            icon="add"
            color="primary"
            onclick={showAdd}
            classnames="btn-xs position-absolute right-0 rounded-full"
            label="Add"
            style={{ top: -7 }}
          />
        )}
        <Col>{textBlock}</Col>
        <Col md={4} className="text-center">
          {dataBlock}
        </Col>
      </Row>
      {partner}
    </>
  );
};

export default BaseBlock;
