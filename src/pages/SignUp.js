import { useState, useEffect } from 'react';
import { Spinner, Alert } from 'reactstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import UserService from '../services/user.service';
import {
  CREATE_YOUR_ACCOUNT,
  EXPIRED_INVITATION_ERROR,
} from '../utils/constants';
import Toast from '../components/Alert/Alert';
import AlertWrapper from '../components/Alert/AlertWrapper';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SignUp() {
  const query = useQuery();
  const token = query.get('token');
  let parts = '';
  let dataToken = '';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const history = useHistory();

  if (!token || token === '') {
    history.push('/login');
  } else {
    parts = token.split('.');
    dataToken = JSON.parse(window.atob(parts[1]));
  }

  useEffect(() => {
    setEmail(dataToken.email);
    const expirationDate = new Date(dataToken.exp * 1000);
    const currentDate = new Date();
    const isExpired = currentDate > expirationDate;

    if (isExpired) {
      setError(EXPIRED_INVITATION_ERROR);
    }
  }, [dataToken]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0
    ) {
      alert('Please enter a value for all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await UserService.acceptInvite(token, {
        first_name: firstName,
        last_name: lastName,
        password,
      });
      history.push('/login');
    } catch (error) {
      setIsLoading(false);
      setToast(error.response.data.message);
    }
  }

  return (
    <PublicLayout>
      <AlertWrapper>
        <Toast message={toast} setMessage={setToast} color={`danger`} />
      </AlertWrapper>
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card card-lg mb-5">
            <div className="card-body">
              {error && <Alert color="danger">{error}</Alert>}
              <form
                className={`js-validate ${error ? 'hide-element' : ''}`}
                onSubmit={handleSubmit}
              >
                <div className="text-center">
                  <div className="mb-5">
                    <h1 className="display-4">{CREATE_YOUR_ACCOUNT}</h1>
                    <p>
                      Already have an account?
                      <a href="/login"> Sign in here</a>
                    </p>
                  </div>
                </div>

                <label className="input-label" htmlFor="fullNameSrEmail">
                  Full name
                </label>

                <div className="form-row">
                  <div className="col-sm-6">
                    <div className="js-form-message form-group">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        name="fullName"
                        id="fullNameSrEmail"
                        placeholder="First Name"
                        aria-label="First Name"
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="js-form-message form-group">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        aria-label="Last Name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="js-form-message form-group">
                  <label className="input-label" htmlFor="signupSrEmail">
                    Your email
                  </label>

                  <input
                    type="email"
                    className="form-control form-control-lg"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={true}
                    id="signupSrEmail"
                    placeholder="example@identifee.com"
                    aria-label="example@identifee.com"
                    required
                    data-msg="Please enter a valid email address."
                  />
                </div>
                <div className="js-form-message form-group">
                  <label className="input-label" htmlFor="signupSrPassword">
                    Password
                  </label>

                  <div className="input-group input-group-merge">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="js-toggle-password form-control form-control-lg"
                      name="password"
                      id="signupSrPassword"
                      placeholder="8+ characters required"
                      aria-label="8+ characters required"
                      required
                    />
                    <div className="js-toggle-password-target-1 input-group-append">
                      <span className="input-group-text cursor-pointer">
                        <i className="js-toggle-passowrd-show-icon-1 tio-visible-outlined"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="js-form-message form-group">
                  <label
                    className="input-label"
                    htmlFor="signupSrConfirmPassword"
                  >
                    Confirm password
                  </label>

                  <div className="input-group input-group-merge">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="js-toggle-password form-control form-control-lg"
                      name="confirmPassword"
                      id="signupSrConfirmPassword"
                      placeholder="8+ characters required"
                      aria-label="8+ characters required"
                      required
                    />
                    <div className="js-toggle-password-target-2 input-group-append">
                      <a className="input-group-text">
                        <i className="js-toggle-passowrd-show-icon-2 tio-visible-outlined"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-lg btn-block btn-primary mb-2"
                >
                  {isLoading ? <Spinner /> : 'Create account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
