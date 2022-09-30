import { useEffect, useState } from 'react';
import { Col, Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';

import './idfModal.css';
import { CheckboxInput } from '../../layouts/CardLayout';
import SimpleModal from '../../modal/SimpleModal';
import IdfInputIcon from '../idfInputs/IdfInputIcon';
import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_REQUIREMENTS,
  PASSWORD_STRENGTH,
  DEFAULT_PASSWORD_RULES,
  REQUIREMENTS_PASSWORD,
} from '../../../utils/constants';
import stringConstants from '../../../utils/stringConstants.json';

const constants = stringConstants.settings.security;
const initialStatusPass = {
  status: 'Very Weak',
  percentage: 1,
  bgColor: 'danger',
};

const IdfModalResetPass = ({
  isOpen,
  modalTitle,
  handleSubmit,
  onHandleCloseModal,
  buttonLabel,
}) => {
  const [checkbox, setCheckbox] = useState(false);
  const [password, setPassword] = useState();
  const [passwordRules, setPasswordRules] = useState(DEFAULT_PASSWORD_RULES);
  const [passwordStatus, setPasswordStatus] = useState(initialStatusPass);

  const setRuleValue = (rule, value) => {
    setPasswordRules((prev) => ({ ...prev, [rule]: value }));
  };

  useEffect(() => {
    if (password?.length) {
      // eslint-disable-next-line no-useless-escape
      const symbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      const lowerCase = /[a-z]/;
      const upperCase = /[A-Z]/;
      const number = /\d/;

      setRuleValue(
        constants.passwordLength,
        password.length >= MIN_PASSWORD_LENGTH
      );
      setRuleValue(constants.uppercase, upperCase.test(password));
      setRuleValue(constants.lowercase, lowerCase.test(password));
      setRuleValue(constants.specialCharacter, symbols.test(password));
      setRuleValue(constants.number, number.test(password));
    } else {
      setPasswordStatus(initialStatusPass);
      setPassword();
    }
  }, [password]);

  useEffect(() => {
    const completedRules = Object.values(passwordRules).filter(
      (item) => item === true
    );
    setPasswordStatus(PASSWORD_STRENGTH[4 * completedRules.length]);
  }, [passwordRules]);

  const closeModal = () => {
    setCheckbox(false);
    setPasswordStatus(initialStatusPass);
    setPassword();
    onHandleCloseModal();
  };

  useEffect(() => {
    if (!checkbox) {
      setPasswordStatus(initialStatusPass);
      setPassword();
    }
  }, [checkbox]);

  const updatePassword = () => {
    handleSubmit(password, !checkbox);
    setCheckbox(false);
  };

  return (
    <SimpleModal
      open={isOpen}
      modalTitle={modalTitle}
      handleSubmit={() => updatePassword()}
      onHandleCloseModal={closeModal}
      buttonLabel={buttonLabel}
      buttonsDisabled={
        checkbox ? !(passwordStatus.percentage === 100) : checkbox
      }
    >
      <Col className="text-center mb-3">
        <i className="material-icons-outlined icon-lock">lock</i>
      </Col>
      <CheckboxInput
        id={`checkbox-auto`}
        onClick={() => setCheckbox(!checkbox)}
        checked={!checkbox}
        label={constants.labelPasswordAutomatically}
      />
      <p className="text-muted pl-4 mb-2">
        {constants.textPasswordAutomatically}
      </p>
      <CheckboxInput
        id={`checkbox-manual`}
        onClick={() => setCheckbox(!checkbox)}
        checked={checkbox}
        label={constants.labelCheckboxManualPassword}
      />
      <Collapse in={checkbox}>
        <div className="pl-4 pr-3 mt-2">
          <span className="font-size-sm">{constants.textPassword}</span>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 300 }}
            overlay={
              <Tooltip id={`tooltip-password`} className={'tooltip-pass'}>
                <div className="text-left">
                  <span>{PASSWORD_REQUIREMENTS}</span>
                  <br />
                  <p>{`Ensure that these requirements are met.`}</p>
                  <ul className="font-size-sm mb-0 pl-3">
                    {REQUIREMENTS_PASSWORD.map((requirement) => (
                      <li data-uw-styling-context="true" key={requirement}>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </Tooltip>
            }
          >
            <div>
              <IdfInputIcon
                className="mt-1 mb-2 w-100"
                icon="help_outline"
                placeholder={constants.placeholderNewPassword}
                type="password"
                onChange={(e) => setPassword(e?.target?.value)}
                value={password || ''}
              />
            </div>
          </OverlayTrigger>

          <div id="changePasswordForm">
            <p id="passwordStrengthVerdict" className="form-text mb-2">
              <span className="password-verdict">{passwordStatus.status}</span>
            </p>
            <div id="passwordStrengthProgress" className="mt-2">
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
        </div>
      </Collapse>
    </SimpleModal>
  );
};

export default IdfModalResetPass;
