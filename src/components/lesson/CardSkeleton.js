import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Row, Col } from 'reactstrap';
import Skeleton from 'react-loading-skeleton';

const CardSkeletonItem = () => {
  return (
    <div className="position-relative col">
      <Card className="h-100 w-100">
        <CardBody>
          <div className="d-flex flex-column text-block text-hover-green">
            <div className="row d-flex flex-row align-items-center mb-4">
              <div className="col">
                <Skeleton circle width={46} height={46} />
              </div>
              <div className="col-auto">
                <Skeleton height={12} width={80} />
              </div>
            </div>
            <div className="mb-3">
              <h5 className="card-title text-hover-primary mb-0">
                <Skeleton height={12} width={150} />
              </h5>
              <span className="card-text text-muted fs-7">
                <Skeleton height={12} width={100} />
              </span>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <Row className="justify-content-between align-items-center">
            <Col className="col-auto d-flex flex-row align-items-center">
              <Skeleton height={18} circle width={18} />
              <Skeleton height={18} className="mx-1" circle width={18} />
            </Col>
            <div className="col-auto text-muted font-size-sm">
              <Skeleton height={12} width={60} />
            </div>
          </Row>
        </CardFooter>
      </Card>
    </div>
  );
};

export default function CardSkeleton({ count }) {
  const [loaderCount] = useState(Array(count).fill(0));
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
      {loaderCount.map((_, index) => (
        <CardSkeletonItem key={index} />
      ))}
    </div>
  );
}
