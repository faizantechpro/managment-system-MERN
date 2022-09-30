import { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { useTenantContext } from '../../contexts/TenantContext';
import authService from '../../services/auth.service';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';

const PublicProfileSignin = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { tenant } = useTenantContext();

  useEffect(() => {
    getTheme();
  }, [tenant]);

  const getTheme = async () => {
    if (tenant?.colors) {
      document.documentElement.style.setProperty(
        '--primaryColor',
        tenant?.colors.primaryColor
      );
      document.documentElement.style.setProperty(
        '--secondaryColor',
        tenant?.colors.secondaryColor
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const resp = await authService
      .guestToken(email)
      .catch(() =>
        setErrorMessage('Your email is not validate for the report')
      );

    if (resp?.response.status === 404) {
      setLoading(false);
      return setErrorMessage('Your email is not validate for the report');
    }

    if (resp) {
      setSuccessMessage('Report sent successfully');
    }

    setLoading(false);
  };

  return (
    <>
      <main id="content" role="main" className="main">
        <div className="container py-5 py-sm-7">
          <div className="d-flex justify-content-center mt-5 mb-5">
            <img
              className="z-index-2"
              src="/img/logo.svg"
              alt="Identifee Logo"
              style={{ width: '16rem' }}
            />
          </div>

          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-5">
              <div className="card card-lg mb-5">
                <div className="card-body">
                  <form className="js-validate" onSubmit={handleSubmit}>
                    <div className="text-center">
                      <div className="mb-5">
                        <span
                          className="material-icons-outlined"
                          style={{ fontSize: '4em' }}
                        >
                          link
                        </span>
                        <h1 className="display-4">
                          Generate a new access link to view the report
                        </h1>
                      </div>
                    </div>

                    <div className="js-form-message form-group">
                      <label className="input-label" htmlFor="signinSrEmail">
                        Email
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
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-lg btn-block btn-primary"
                    >
                      {loading ? <Spinner /> : <span>Resend report link</span>}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default PublicProfileSignin;
