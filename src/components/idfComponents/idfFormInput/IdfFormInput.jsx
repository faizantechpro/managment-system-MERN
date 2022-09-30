import { FormGroup, Input, Label } from 'reactstrap';

const IdfFormInput = ({
  label,
  placeholder,
  name,
  value,
  onChange,
  type,
  className = '',
  max,
  icon,
  inputClassName = '',
  ...restProps
}) => {
  const onHandleChange = (e) => {
    const { value, min, max } = e.target;
    if (Number(value) <= Number(max) && Number(value) >= Number(min)) {
      onChange(e);
    }
  };

  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  };

  return (
    <FormGroup className={`${className} position-relative`}>
      {label && <Label>{label}</Label>}
      {icon && (
        <div className="material-icons-outlined pos-icon-inside-imput">
          <span>{icon}</span>
        </div>
      )}
      <Input
        className={`${icon ? 'pl-5' : ''} ${inputClassName}`}
        {...restProps}
        name={name}
        type={type}
        max={max}
        min={0}
        id={name}
        onChange={max ? onHandleChange : onChange}
        placeholder={placeholder}
        value={
          name === 'phone_office'
            ? formatPhoneNumber(value[name])
            : value[name] || ''
        }
      />
    </FormGroup>
  );
};

IdfFormInput.defaultProps = {
  type: 'text',
  placeholder: '',
  value: {},
};

export default IdfFormInput;
