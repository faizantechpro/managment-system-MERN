import React from 'react';
import { Table as BTable, Card, CardFooter, Row, Col } from 'reactstrap';
import Pagination from './Pagination';

const Table = ({ columns, paginationInfo, onPageChange, children }) => {
  return (
    <Card className="overflow-hidden">
      <BTable
        bordered
        borderless
        responsive
        size="lg"
        className="table-nowrap table-text-center table-align-middle card-table"
      >
        <thead className="thead-light">
          <tr>
            {columns.map((column) => {
              return (
                <th scope="col" key={column.key} className={column.className}>
                  {column.render ? column.render() : column.title}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </BTable>
      <CardFooter>
        <Row>
          <Col sm className="mb-2 mb-sm-0" />
          <Col className="col-sm-auto">
            <Pagination
              paginationInfo={paginationInfo}
              onPageChange={onPageChange}
            />
          </Col>
        </Row>
      </CardFooter>
    </Card>
  );
};
// col-sm
// col-sm-auto
export default Table;
