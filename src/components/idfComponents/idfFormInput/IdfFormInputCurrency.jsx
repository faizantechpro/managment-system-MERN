import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import CurrencyInput from 'react-currency-input-field';

const IdfFormInputCurrency = ({
  label,
  placeholder,
  name,
  value,
  onChange,
  className = '',
  max,
  min,
  icon,
}) => {
  const onHandleChange = (val, name) => {
    if (Number(val) <= Number(max) && Number(val) >= Number(min)) {
      onChange({ target: { value: val, name } });
    }
  };

  return (
    <FormGroup className={`${className} position-relative`}>
      {label && <Label>{label}</Label>}
      {icon && (
        <div className="material-icons-outlined pos-icon-inside-imput">
          <span>{icon}</span>
        </div>
      )}
      <CurrencyInput
        id={name}
        className="form-control"
        name={name}
        placeholder={placeholder}
        prefix={'$'}
        value={value[name]}
        decimalsLimit={2}
        onValueChange={onHandleChange}
      />
    </FormGroup>
  );
};

IdfFormInputCurrency.defaultProps = {
  type: 'text',
  placeholder: '',
  value: {},
};

export default IdfFormInputCurrency;
