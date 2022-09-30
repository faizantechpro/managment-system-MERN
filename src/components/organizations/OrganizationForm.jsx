import React from 'react';
import { Col, Row } from 'reactstrap';
import { Form } from 'react-bootstrap';
import { onInputChange } from '../../views/Deals/contacts/utils';

const OrganizationForm = ({
  dispatch,
  orgFormData,
  fields,
  refresh,
  ...props
}) => {
  const onChange = (e) => {
    onInputChange(e, dispatch);
  };

  return (
    <Form>
      <Row>
        {fields.map((field) => {
          const { component, colSize, className, ...restProps } = field;
          return (
            <Col key={field.id} xs={colSize} className={className}>
              {React.cloneElement(component, {
                value: orgFormData,
                onChange,
                refresh,
                ...props,
                ...restProps,
              })}
            </Col>
          );
        })}
      </Row>
    </Form>
  );
};

export default OrganizationForm;
