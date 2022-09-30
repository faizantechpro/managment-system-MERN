import React from 'react';
import IdfFormInput from '../../../idfComponents/idfFormInput/IdfFormInput';
import Wrapper from './Wrapper';

const InputWrapper = ({ title, icon, value, name, placeholder, onChange }) => {
  return (
    <Wrapper title={title} icon={icon} value={value[name]}>
      <IdfFormInput
        className="mb-0"
        inputClassName="border-0"
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
      />
    </Wrapper>
  );
};

export default InputWrapper;
