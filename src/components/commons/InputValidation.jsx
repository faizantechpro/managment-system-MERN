import { FormControl } from 'react-bootstrap';
import React from 'react';
import ValidationErrorText from './ValidationErrorText';

// generic component with validation logic with react-hook-form, will be using this or customize it more as we move forward
// right now, using it in create category modal
const InputValidation = ({
  name,
  type,
  placeholder,
  value,
  register,
  validationConfig,
  errors,
  classNames,
  errorDisplay,
  ...rest
}) => {
  return (
    <div className="position-relative w-100">
      <FormControl
        as={type}
        placeholder={`${placeholder} ${validationConfig.inline ? '*' : ''}`}
        value={value}
        name={name}
        {...rest}
        className={`${classNames} ${errors[name] ? 'border-danger' : ''}`}
        {...register(name, validationConfig)}
      />
      {errors[name]?.type === 'required' && (
        <ValidationErrorText
          text={`${placeholder} is required.`}
          extraClass={errorDisplay}
        />
      )}
      {errors[name]?.type === 'maxLength' && (
        <ValidationErrorText
          text={errors[name]?.message}
          extraClass={errorDisplay}
        />
      )}
    </div>
  );
};

export default InputValidation;
