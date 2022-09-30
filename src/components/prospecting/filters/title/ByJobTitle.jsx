import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import '../../style.css';

const ByJobTitle = ({ data, setData }) => {
  const setInfo = (key, value) => {
    const newData = {
      ...data,
      title: {
        ...data.title,
        [key]: value,
      },
    };

    setData(newData);
  };

  const onHandleChangeRadio = (id) => {
    setInfo('title_search_mode', id);
  };

  const onHandleChangeText = (e) => {
    const { value } = e.target;

    setInfo('titles', value);
  };

  const onClear = () => {
    setInfo('titles', '');
  };

  return (
    <div>
      <p className="fw-normal">Type in job titles or keywords</p>
      <Form.Group className="mb-3">
        <Row noGutters>
          <Col sm={6} onClick={() => onHandleChangeRadio('include')}>
            <Form.Check
              inline
              type="radio"
              checked={data.title.title_search_mode === 'include'}
              name="exact"
              id="include"
              label="Includes"
            />
          </Col>
          <Col sm={6} onClick={() => onHandleChangeRadio('exact')}>
            <Form.Check
              inline
              type="radio"
              id="exact"
              checked={data.title.title_search_mode === 'exact'}
              name="exact"
              label="Exact match"
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Control
        as="textarea"
        type="text"
        onChange={onHandleChangeText}
        value={data.title.titles}
        placeholder={`Enter job titles or keywords One per line, example:\nOwner\nCEO\nIT Director`}
        className="size-textarea-filter mb-3"
      />
      <span
        className="w-100 p-2 text-muted cursor-pointer fs-6"
        onClick={onClear}
      >
        &times; Clear All Job Titles
      </span>
    </div>
  );
};

export default ByJobTitle;
