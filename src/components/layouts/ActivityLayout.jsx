import { useState, useEffect } from 'react';
import {
  Card as CardBt,
  Row,
  Col,
  Form,
  Container,
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';

import TextInput from '../inputs/TextInput';
import './layout.css';

export const Card = ({ children }) => {
  return <CardBt>{children}</CardBt>;
};

export const CardHeader = ({ children }) => {
  return (
    <CardBt.Header className="p-3 sticky-header">{children}</CardBt.Header>
  );
};

export const CardForm = ({ children }) => {
  return (
    <Container>
      <Form>{children}</Form>
    </Container>
  );
};

export const CardSection = ({ children, endLine }) => {
  const endLineClass = endLine ? ' border-bottom' : '';

  return <Row className={`px-3 ${endLineClass}`}>{children}</Row>;
};

export const CardBlock = ({ children }) => {
  return <Col className="p-1">{children}</Col>;
};

export const CardContent = ({ children }) => {
  return (
    <Col className="pl-0 pr-0 pr-md-3" sm={12} md={7}>
      {children}
    </Col>
  );
};

export const CardSide = ({ children, className }) => {
  return (
    <Col
      className={`pl-0 pl-md-3 pr-0 mb-4 border-md-left ${className || ''}`}
      sm={12}
      md={5}
    >
      {children}
    </Col>
  );
};

export const CardTitle = ({ children }) => {
  return (
    <CardBt.Title as="h3" className="p-1">
      {children}
    </CardBt.Title>
  );
};

export const CardSubtitle = ({ children, endLine }) => {
  const endLineClass = endLine ? ' border-bottom' : '';

  return (
    <CardBt.Title as="h4" className={`mx-1 pb-3${endLineClass}`}>
      {children}
    </CardBt.Title>
  );
};

export const CardSubContent = ({ children }) => {
  return <div className="mx-1 pt-3 pb-6">{children}</div>;
};

export const CardLabel = ({
  children,
  label,
  labelSize,
  id,
  formClassName,
  containerClassName,
}) => {
  return (
    <Form.Group as={Row} className={`${formClassName || `my-2`}`}>
      {label && (
        <Form.Label
          id={id}
          className={labelSize === `full` ? 'pb-2' : 'label-mw'}
          column
          xs={labelSize === `full` ? 12 : ''}
        >
          <span>{label}</span>
        </Form.Label>
      )}
      <div className={`${containerClassName || `pl-2 pr-3`} w-100`}>
        {children}
      </div>
    </Form.Group>
  );
};

export const List = ({ children, className }) => {
  return (
    <Col xs={12} className={`px-0 mt-3 ${className}`}>
      {children}
    </Col>
  );
};

export const Item = ({ children, onClick }) => {
  return (
    <div className="py-2 item-btn rounded w-100" onClick={onClick}>
      <Row className="item-container" noGutters>
        {children}
      </Row>
    </div>
  );
};

export const ItemAvatar = ({ children }) => {
  return <Col className="item-avatar rounded-circle">{children}</Col>;
};

export const ItemUser = (itemUserProps) => {
  return (
    <Col id={itemUserProps.id} className="item-user mr-3">
      <h5 className="mb-0">{itemUserProps.name}</h5>
      <p className="m-0">{itemUserProps.email}</p>
    </Col>
  );
};

export const ItemActions = ({ children }) => {
  return <Col className="item-actions text-right">{children}</Col>;
};

export const CardButton = ({
  variant,
  id,
  ref,
  disabled,
  onClick,
  title,
  icon,
  className,
}) => {
  return (
    <Button
      ref={ref}
      id={id}
      type="button"
      variant={variant || ''}
      onClick={onClick}
      disabled={disabled || false}
      className={className}
    >
      <span className="material-icons-outlined">{icon}</span> {title}
    </Button>
  );
};

export const SwitchInput = ({ id, checked, onChange, onClick, label }) => {
  return (
    <div className="custom-control custom-switch py-1">
      <input
        type="checkbox"
        className="custom-control-input"
        id={id}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
      />
      <label className="custom-control-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export const ButtonsGroup = ({ placement, buttons, value, setValue }) => {
  const handler = (button) => {
    setValue(button);
  };

  return (
    <div className={`row pl-3 mr-0 pt-2`}>
      {buttons.map((button) => (
        <OverlayTrigger
          key={button.name}
          button={placement}
          overlay={
            <Tooltip
              id={`tooltip-${button.name}`}
              className={`font-weight-bold`}
            >
              {button.name}
            </Tooltip>
          }
        >
          <Button
            variant={`outline-group`}
            className={`col ${value === button.type && `active `}`}
            onClick={() => handler(button.type)}
          >
            <span className="material-icons-outlined">{button.icon}</span>
          </Button>
        </OverlayTrigger>
      ))}
    </div>
  );
};

export const ConferenceButton = ({
  label,
  labelSize,
  onChange,
  valueButton,
}) => {
  const [inputShow, setInputShow] = useState(false);

  const conferenceInputHandler = (e) => {
    setInputShow(!inputShow);
  };

  useEffect(() => {
    valueButton(inputShow);
  }, [inputShow]);

  return (
    <div className="btn-conference">
      <CardLabel label={label} labelSize={labelSize}>
        <CardButton
          title={!inputShow ? `Add video conferencing` : `Hide`}
          icon={`video_call`}
          variant={`primary`}
          className={`btn-semi-bold z-index-5`}
          onClick={() => {
            conferenceInputHandler();
          }}
        />
        <CSSTransition
          in={inputShow}
          timeout={200}
          unmountOnExit
          classNames={`animation`}
        >
          <TextInput
            id={`activity-video-conference`}
            labelSize={`full`}
            placeholder={`Conference link`}
            onChange={onChange}
          />
        </CSSTransition>
      </CardLabel>
    </div>
  );
};
