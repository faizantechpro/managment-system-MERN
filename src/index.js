import * as Sentry from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom';
import TagManager from 'react-gtm-module';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const { NODE_ENV, REACT_GTM_KEY, REACT_APP_TRACING_SENTRY_DSN } = process.env;

const tagManagerArgs = {
  gtmId: REACT_GTM_KEY,
};

TagManager.initialize(tagManagerArgs);

if (REACT_APP_TRACING_SENTRY_DSN) {
  Sentry.init({
    dsn: REACT_APP_TRACING_SENTRY_DSN,
    environment: NODE_ENV,
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
