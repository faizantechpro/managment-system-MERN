import React from 'react';

import { FormGroup, Label } from 'reactstrap';

const FormCourses = ({ course, onHandleChange }) => {
  const { description } = course || {};

  return (
    <div>
      <FormGroup>
        <Label for="description">Description</Label>
        <textarea
          className="form-control"
          name="description"
          id="description"
          rows={4}
          placeholder="Description"
          aria-label="Description"
          value={description || ''}
          onChange={onHandleChange}
        />
      </FormGroup>
    </div>
  );
};

export default FormCourses;
