import React, { useState, useEffect } from 'react';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_REQUIREMENTS,
  PASSWORD_STRENGTH,
  DEFAULT_PASSWORD_RULES,
  REQUIREMENTS_PASSWORD,
} from '../../utils/constants';
import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.settings.security;

function FormItem({
  label,
  name,
  placeholder,
  value,
  onChange,
  progressBar,
  requirements,
}) {
  const [passwordRules, setPasswordRules] = useState(DEFAULT_PASSWORD_RULES);

  const [passwordStatus, setPasswordStatus] = useState({
    status: '',
    percentage: '1%',
    bgColor: 'danger',
  });

  const setRuleValue = (rule, value) => {
    setPasswordRules((prev) => ({ ...prev, [rule]: value }));
  };

  useEffect(() => {
    if (value.length >= MIN_PASSWORD_LENGTH) {
      setRuleValue(constants.passwordLength, true);
      setRuleValue(constants.uppercase, value.search(/[A-Z]/) !== -1);
      setRuleValue(constants.lowercase, value.search(/[a-z]/) !== -1);
    } else {
      setRuleValue(constants.passwordLength, false);
      setRuleValue(constants.uppercase, false);
      setRuleValue(constants.lowercase, false);
    }

    setRuleValue(constants.number, value.search(/(?=.*?[0-9])/g) !== -1);
    setRuleValue(
      constants.specialCharacter,
      value.search(/(?=.*?[#? !@$%^&*-])/g) !== -1
    );
  }, [value]);

  useEffect(() => {
    const completedRules = Object.values(passwordRules).filter(
      (item) => item === true
    );
    setPasswordStatus(PASSWORD_STRENGTH[4 * completedRules.length]);
  }, [passwordRules]);

  return (
    <FormGroup className="row form-group">
      <Label
        for={`${name}Label`}
        className="col-sm-3 col-form-label input-label"
        data-uw-styling-context="true"
      >
        {label}
      </Label>
      <div className="col-sm-9">
        <Input
          type="password"
          className="form-control"
          name={name}
          id={`${name}Label`}
          placeholder={placeholder}
          aria-label={placeholder}
          data-uw-styling-context="true"
          value={value}
          pattern={progressBar && '(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9]).{8,}'}
          onChange={onChange}
          invalid={!!value && progressBar && passwordStatus.percentage < 80}
          required
        />
        <FormFeedback>Please provide a valid password.</FormFeedback>

        {requirements && (
          <div className="mt-3">
            <h5 data-uw-styling-context="true">{PASSWORD_REQUIREMENTS}</h5>
            <p className="font-size-sm mb-2" data-uw-styling-context="true">
              Ensure that these requirements are met:
            </p>
            <ul className="font-size-sm">
              {REQUIREMENTS_PASSWORD.map((requirement) => (
                <li data-uw-styling-context="true" key={requirement}>
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {progressBar && (
          <div id="changePasswordForm">
            <p id="passwordStrengthVerdict" className="form-text mb-2">
              <span className="password-verdict">{passwordStatus.status}</span>
            </p>
            <div id="passwordStrengthProgress">
              <div className="progress false">
                <div
                  className={`progress-bar bg-${
                    passwordStatus.bgColor || 'danger'
                  }`}
                  style={{
                    minWidth: '1px',
                    width: `${passwordStatus.percentage}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormGroup>
  );
}

export default FormItem;
