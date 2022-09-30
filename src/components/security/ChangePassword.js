import React, { useState } from 'react';
import { Form, Spinner } from 'reactstrap';

import FormItem from './FormItem';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import userService from '../../services/user.service';
import { DEFAULT_PASSWORD_INFO } from '../../utils/constants';
import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.settings.security;

const ChangePassword = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordInfo, setPasswordInfo] = useState(DEFAULT_PASSWORD_INFO);
  const [isLoading, setIsLoading] = useState(false);

  const onHandleChange = (e) => {
    setPasswordInfo({
      ...passwordInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmNewPassword } = passwordInfo;

    if (!currentPassword || newPassword !== confirmNewPassword) {
      return setErrorMessage(constants.passwordDontMatch);
    }

    try {
      setIsLoading(true);
      const resp = await userService.updatePassword(passwordInfo);

      if (resp) {
        setPasswordInfo(DEFAULT_PASSWORD_INFO);
        setSuccessMessage(constants.successMessage);
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.error || constants.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="password" className="card mb-3 mb-lg-5">
      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
      </AlertWrapper>

      <div className="card-header">
        <h4 className="card-title" data-uw-styling-context="true">
          {constants.changePassword}
        </h4>
      </div>
      <div className="card-body">
        <p className="card-text" data-uw-styling-context="true">
          {constants.changePasswordDescription}
        </p>
        <Form
          id="changePasswordForm"
          onSubmit={onHandleSubmit}
          className="needs-validation"
        >
          <FormItem
            onChange={onHandleChange}
            label={constants.currentPassword}
            name="currentPassword"
            value={passwordInfo.currentPassword}
            placeholder="Enter current password"
          />

          <FormItem
            onChange={onHandleChange}
            label={constants.newPassword}
            name="newPassword"
            value={passwordInfo.newPassword}
            placeholder="Enter new password"
            progressBar
          />

          <FormItem
            onChange={onHandleChange}
            label={constants.confirmNewPassword}
            name="confirmNewPassword"
            value={passwordInfo.confirmNewPassword}
            placeholder="Confirm your new password"
            requirements
          />

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              data-uw-styling-context="true"
            >
              {isLoading ? <Spinner /> : constants.save}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
