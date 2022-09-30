import { useState } from 'react';
import { Spinner, Alert } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { PublicLayout } from '../layouts/PublicLayout';

export default function Reset() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsLoading(true);
      await AuthService.requestPassword(email);
      setIsLoading(false);
      setSuccess('New password request submitted.');
      setTimeout(() => {
        history.push('/login');
      }, 2000);
    } catch (e) {
      setIsLoading(false);
      setError(
        'Error! No user exists with this email address. Please enter correct email address.'
      );
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }

  return (
    <PublicLayout>
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card card-lg mb-5">
            <div className="card-body">
              <form className="js-validate" onSubmit={handleSubmit}>
                <div className="text-center">
                  <div className="mb-5">
                    <span className="forget-label">Forgot password?</span>
                    <p>{`Enter the email address you used when you joined and we'll send you instructions to reset your password.`}</p>
                  </div>
                </div>

                {error !== '' ? <Alert color="danger">{error}</Alert> : null}
                {success !== '' ? (
                  <Alert color="success">{success}</Alert>
                ) : null}

                <div className="js-form-message form-group">
                  <label
                    className="input-label"
                    htmlFor="resetPasswordSrEmail"
                    tabIndex="0"
                  >
                    Your Email
                  </label>

                  <input
                    type="email"
                    className="form-control form-control-lg"
                    name="email"
                    id="resetPasswordSrEmail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    tabIndex="1"
                    placeholder="Enter your email address"
                    aria-label="Enter your email address"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-lg btn-block btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner /> : ' '}
                  Reset Password Link
                </button>

                <div className="text-center mt-2">
                  <a
                    className="btn btn-link"
                    onClick={() => history.push('/login')}
                  >
                    <i className="tio-chevron-left"></i> Back to Log In
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
