import { useState } from 'react';
import { Spinner, Alert } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import AuthService from '../services/auth.service';

import { useAppContext } from '../contexts/appContext';
import stringConstants from '../utils/stringConstants.json';
import { searchParams } from '../utils/Utils';
import { PublicLayout } from '../layouts/PublicLayout';
import { useProfileContext } from '../contexts/profileContext';

const constants = stringConstants.login;

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userHasAuthenticated } = useAppContext();
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [code, setCode] = useState('');
  const [isOTPEnabled, setIsOTPEnabled] = useState(false);
  const { search } = history.location;
  const { setProfileInfo } = useProfileContext();

  const handleSubmit = (event) => {
    event.preventDefault();

    setIsLoading(true);
    AuthService.login(email, password, code)
      .then((resp) => {
        if (resp.access_token === 'otp_enabled') {
          setIsOTPEnabled(true);
        } else {
          userHasAuthenticated(true);
          setProfileInfo({});
          const redirect_uri = searchParams(search, 'redirect_uri');
          if (redirect_uri) {
            history.push(redirect_uri);
          } else {
            history.push('/');
          }
        }
      })
      .catch((error) => {
        if (code) {
          setError(constants.invalidCodeMessage);
        } else {
          setError(error?.response?.data?.errors?.[0]?.message);
        }
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const resendCode = async () => {
    await AuthService.login(email, password);
    setCode('');
    setInfo('New code sent');
    setTimeout(() => {
      setInfo('');
    }, 3000);
  };

  const renderLogin = () => (
    <form className="js-validate px-3" onSubmit={handleSubmit}>
      {error !== '' ? <Alert color="danger">{error}</Alert> : null}

      <div className="js-form-message form-group">
        <label className="input-label" htmlFor="signinSrEmail">
          Your Email
        </label>

        <input
          type="email"
          className="form-control form-control-lg"
          name="email"
          id="signinSrEmail"
          tabIndex="0"
          placeholder="email@address.com"
          aria-label="email@address.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isOTPEnabled}
        />
      </div>

      <div className="js-form-message form-group">
        <label className="input-label">
          <span className="d-flex justify-content-between align-items-center">
            Password
          </span>
        </label>

        <div className="input-group input-group-merge">
          <input
            type="password"
            className="js-toggle-password form-control form-control-lg"
            name="password"
            id="signupSrPassword"
            tabIndex="0"
            aria-label="8+ characters required"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div id="changePassTarget" className="input-group-append">
            <a className="input-group-text">
              <i id="changePassIcon" className="tio-visible-outlined"></i>
            </a>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="btn btn-lg btn-block btn-primary"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : 'Log In'}
        </button>
      </div>
      <div className="w-100 mt-4">
        <span
          className="input-label-secondary cursor-pointer"
          onClick={() => history.push('/request-password')}
        >
          Forgot Password?
        </span>
      </div>
    </form>
  );

  const renderOTP = () => (
    <form className="js-validate" onSubmit={handleSubmit}>
      <div className="text-center">
        <div className="mb-5">
          <h1 className="display-4">Two-step Verification</h1>

          <p className="mb-0">
            We sent a verification code to your email.
            <br />
            Enter the code from the email in the field below.
          </p>
        </div>
      </div>

      {error !== '' ? <Alert color="danger">{error}</Alert> : null}
      {info !== '' ? <Alert color="info">{info}</Alert> : null}
      <div className="js-form-message form-group">
        <label className="input-label">
          <span className="d-flex justify-content-between align-items-center">
            Enter Code
          </span>
        </label>

        <div className="input-group input-group-merge">
          <input
            type="text"
            className="js-toggle-password form-control form-control-lg"
            placeholder="000000"
            name="otp_code"
            id="otp_code"
            maxLength="6"
            tabIndex="1"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[a-zA-Z ]/g, ''))}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-lg btn-block btn-primary"
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : 'Verify'}
      </button>
      <div className="text-center mt-3">
        <p>
          {`Haven't received it? `}
          <a href="#!" onClick={resendCode}>
            Resend a new code.
          </a>
        </p>
      </div>
    </form>
  );

  return (
    <PublicLayout>
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card card-lg mb-5">
            <div className="card-body">
              {!isOTPEnabled ? renderLogin() : renderOTP()}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;
