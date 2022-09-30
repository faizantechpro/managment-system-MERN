import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.settings.resources.questions;

const CheckDefault = ({ opt, select, questionId, onHandleChange }) => {
  const { id, answer } = opt;
  return (
    <div className="text-left border border-secondary rounded py-2 px-3 mb-3 d-flex align-items-center">
      <Form.Check
        inline
        label={`${id}. ${answer}`}
        checked={select === id || false}
        name="group1"
        type="radio"
        onChange={() => onHandleChange({ ...opt, question_id: questionId })}
        id={id}
      />
    </div>
  );
};

const ItemStep = ({ index, count, page, select, onHandleChange }) => {
  const { title, qoption, id } = page;

  return (
    <Row noGutters className="w-100 d-flex justify-content-center text-center">
      <Col xs={12}>
        <span className="fs-6">
          {constants.label} {index + 1}/{count}
        </span>
      </Col>
      <Col xs={12}>
        <h2 className="py-2 text-capitalize">{title}</h2>
      </Col>
      <Col xs={12} className="d-flex justify-content-center">
        <div className="min-w-50">
          <Form>
            {qoption.map((opt, index) => (
              <CheckDefault
                key={index}
                opt={opt}
                questionId={id}
                select={select}
                onHandleChange={onHandleChange}
              />
            ))}
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default ItemStep;
