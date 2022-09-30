import React from 'react';
import ValidationErrorText from './ValidationErrorText';
import { Controller } from 'react-hook-form';

// generic component with validation logic with react-hook-form, will be using this or customize it more as we move forward
// right now, using it in lesson create UI
const ControllerValidation = ({
  name,
  validationConfig,
  errors,
  control,
  errorDisplay,
  renderer,
  form,
}) => {
  return (
    <div className="position-relative w-100">
      <Controller
        render={renderer}
        name={name}
        rules={validationConfig}
        control={control}
      />
      {errors[name] && !form[name] && (
        <ValidationErrorText
          text={errors[name]?.message}
          extraClass={errorDisplay}
        />
      )}
    </div>
  );
};

export default ControllerValidation;
