import React from 'react';
import { Form } from 'react-bootstrap';

const ByContactName = ({ data, setData }) => {
  const onHandleChange = (e) => {
    const { value } = e.target;

    setData({
      ...data,
      contact: {
        name: value,
      },
    });
  };

  return (
    <Form.Group controlId="formBasicEmail">
      <Form.Label className="fw-normal">Search by Contact Name</Form.Label>
      <Form.Control
        type="text"
        placeholder="Contact name"
        value={data.contact.name}
        onChange={onHandleChange}
      />
    </Form.Group>
  );
};

export default ByContactName;
