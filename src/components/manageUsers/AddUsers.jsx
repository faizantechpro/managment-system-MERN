import React, { useState } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

import { validateEmail } from '../../utils/Utils';
import {
  INVITATION_SENT,
  INVITE_FORM_TEXT,
  UNKNOWN_ERROR,
} from '../../utils/constants';

const AddUsers = ({
  inputValue,
  setInputValue,
  setEmails,
  emails,
  sentReport,
}) => {
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.includes('\n') || value.includes(',')) {
      let emailList = value.split(/[\n,]/).map((email) => email.trim());
      emailList = emailList.filter((email) => validateEmail(email));
      setEmails((prev) => [...new Set([...prev, ...emailList])]);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (event) => {
    if (['Enter', 'Tab', ','].includes(event.key)) {
      event.preventDefault();

      const email = inputValue.trim();
      if (email && validateEmail(email)) {
        setError('');
        setEmails((prev) => [...new Set([...prev, email])]);
        setInputValue('');
      } else {
        setError(`${email} is not a valid email address.`);
      }
    }
  };

  const handleDelete = (email) => {
    setEmails((prev) => {
      return prev.filter((prevItem) => prevItem !== email);
    });
  };

  return (
    <>
      {sentReport.length > 0 ? (
        <>
          <p>{INVITATION_SENT}</p>
          <ListGroup>
            {sentReport.map((report) => (
              <ListGroupItem key={report.email}>
                {report.email}{' '}
                {report.isValid ? (
                  `✅`
                ) : report.error.message ? (
                  <span className="text-danger">❌ {report.error.message}</span>
                ) : (
                  <span className="text-danger">❌ {UNKNOWN_ERROR}</span>
                )}
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      ) : (
        <>
          <p>{INVITE_FORM_TEXT}</p>
          {emails.map((email) => (
            <div className="tag-item" key={email}>
              {email}

              <button
                type="button"
                className="button"
                onClick={() => handleDelete(email)}
              >
                &times;
              </button>
            </div>
          ))}
          <div className="form-group">
            <textarea
              className={`form-control ${error ? 'has-error' : ''}`}
              rows="4"
              placeholder="name@domain.com, name2@domain.com"
              aria-label="User Emails"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              value={inputValue}
            ></textarea>
            {error && <p className="error">{error}</p>}
            <small className="form-text text-muted">
              Duplicate email addresses will be removed.
            </small>
          </div>
        </>
      )}
    </>
  );
};

export default AddUsers;
