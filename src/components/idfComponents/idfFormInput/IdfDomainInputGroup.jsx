import { useEffect, useState } from 'react';
import { InputGroup, InputGroupText, Input, Label } from 'reactstrap';

const IdfDomainInputGroup = ({
  label,
  placeholder,
  name,
  value,
  onChange,
  type,
  className = '',
  groupText = '',
  max,
  ...restProps
}) => {
  const [domain, setDomain] = useState(groupText || '');
  const [subdomain, setSubdomain] = useState('');

  useEffect(() => {
    if (value) {
      const splitValue = value.split('.');
      if (splitValue.length === 3) {
        setDomain(`.${splitValue[1]}.${splitValue[2]}`);
      }
      setSubdomain(splitValue[0]);
    }
  }, []);

  const onHandleChange = (e) => {
    setSubdomain(e.target.value);
    onChange({
      target: {
        name,
        value: `${e.target.value}${domain}`,
      },
    });
  };

  return (
    <div className={className}>
      <Label>{label}</Label>
      <InputGroup>
        <Input
          {...restProps}
          name={name}
          type={type}
          max={max}
          min={0}
          id={name}
          onChange={onHandleChange}
          placeholder={placeholder}
          value={subdomain}
        />
        <InputGroupText>{domain}</InputGroupText>
      </InputGroup>
    </div>
  );
};

IdfDomainInputGroup.defaultProps = {
  type: 'text',
  placeholder: '',
  value: {},
};

export default IdfDomainInputGroup;
