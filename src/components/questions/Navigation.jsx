import React from 'react';
import { Button, Row } from 'react-bootstrap';

const Navigation = (props) => {
  const { size, current, onClick, next } = props;

  return (
    <>
      {current !== size && (
        <Row noGutters className="d-flex justify-content-center">
          <div className="min-w-50 text-right">
            <Button
              className="w-25"
              type="primary"
              onClick={() => onClick(next, current === size - 1)}
            >
              {size - 1 !== current ? 'Next' : 'Review'}
            </Button>
          </div>
        </Row>
      )}
    </>
  );
};

export default Navigation;
