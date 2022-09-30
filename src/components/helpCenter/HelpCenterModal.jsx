import { useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';

import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import userService from '../../services/user.service';
import {
  EMAIL_LABEL,
  HELPCENTER_DESCRIPTION,
  MESSAGE_LABEL,
  MESSAGE_PLACEHOLDER,
  NAME_LABEL,
  SEND_MESSAGE,
  SUBMIT_SUCCESSFULLY,
  SUPPORT_TICKET,
} from '../../utils/constants';
import { validateEmail } from '../../utils/Utils';
import SimpleModalCreation from '../modal/SimpleModalCreation';
import { DEFAULT_HELP_FORM } from './HelpCenter.constants';

export default function HelpCenterModal(props) {
  const { modal, toggle, setSentMessage } = props;

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [helpForm, setHelpForm] = useState(DEFAULT_HELP_FORM);

  async function sendMessage(data) {
    return await userService.sendMessage(data);
  }

  async function onHandleSubmit() {
    setIsLoading(true);

    if (!helpForm.name) {
      setIsLoading(false);
      return setErrorMessage('Name is required');
    }

    const isEmail = validateEmail(helpForm.email);

    if (!isEmail) {
      setIsLoading(false);
      return setErrorMessage('Email is invalid');
    }

    if (!helpForm.message) {
      setIsLoading(false);
      return setErrorMessage('Message is required');
    }

    const sentMessage = await sendMessage(helpForm).catch((err) =>
      setErrorMessage(err)
    );

    if (sentMessage.status) {
      setSentMessage(SUBMIT_SUCCESSFULLY);
      setHelpForm(DEFAULT_HELP_FORM);
      toggle();
    }

    setIsLoading(false);
  }

  function onInputChange(e) {
    setHelpForm({
      ...helpForm,
      [e.target.name]: e.target.value,
    });
  }

  function onHandleCloseModal() {
    setHelpForm(DEFAULT_HELP_FORM);
    toggle();
  }

  return (
    <SimpleModalCreation
      modalTitle={SUPPORT_TICKET}
      open={modal}
      handleSubmit={onHandleSubmit}
      onHandleCloseModal={onHandleCloseModal}
      errorMessage={errorMessage}
      isLoading={isLoading}
      saveButton={SEND_MESSAGE}
    >
      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <div>
        <p>{HELPCENTER_DESCRIPTION}</p>
        <Form>
          <FormGroup>
            <Label htmlFor="title">{NAME_LABEL}</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={helpForm.name}
              onChange={onInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="title">{EMAIL_LABEL}</Label>
            <Input
              type="email"
              name="email"
              id="email"
              invalid={helpForm.email !== '' && !validateEmail(helpForm.email)}
              value={helpForm.email}
              onChange={onInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="title">{MESSAGE_LABEL}</Label>
            <Input
              type="textarea"
              name="message"
              id="message"
              rows={5}
              placeholder={MESSAGE_PLACEHOLDER}
              value={helpForm.message}
              onChange={onInputChange}
            />
          </FormGroup>
        </Form>
      </div>
    </SimpleModalCreation>
  );
}
