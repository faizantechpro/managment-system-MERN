import { HelmetProvider } from 'react-helmet-async';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import moment from 'moment-timezone';

import { AppRouter } from './router';
import { AppProvider, useAppContext } from './contexts/appContext';
import { CategoriesProvider } from './contexts/categoriesContext';
import authService from './services/auth.service';
import { BeaconProvider } from './contexts/BeaconContext';
import { ToggleMenuProvider } from './contexts/toogleMenuContext';
import { ViewportProvider } from './contexts/viewportContext';
import { ProfileProvider } from './contexts/profileContext';
import { AdaProvider } from './contexts/AdaContext';
import { TabsProvider } from './contexts/tabsContext';
import { LearningPathProvider } from './contexts/LearningPathContext';
import { PermissionsProvider } from './contexts/permissionContext';
import { AlertMessageProvider } from './contexts/AlertMessageContext';
import { TenantProvider } from './contexts/TenantContext';
import { FilterProspectProvider } from './contexts/filterProspectContext';
import { PipelineBoardProvider } from './contexts/PipelineBoardContext';

// styles
import './theme.css';
import './css/style.min.css';
import './App.css';

const ReactGAKey = process.env.REACT_GAKEY || 'your_reactgakey';

const composeProviders =
  (...providers) =>
  ({ children }) => {
    return providers.reduceRight(
      (child, Provider) => <Provider>{child}</Provider>,
      children
    );
  };

const Providers = composeProviders(
  HelmetProvider,
  TenantProvider,
  AppProvider,
  BeaconProvider,
  AdaProvider,
  CategoriesProvider,
  ProfileProvider,
  ToggleMenuProvider,
  ViewportProvider,
  TabsProvider,
  LearningPathProvider,
  PermissionsProvider,
  AlertMessageProvider,
  FilterProspectProvider,
  PipelineBoardProvider
);

const App = () => {
  const { userHasAuthenticated } = useAppContext();
  ReactGA.initialize(ReactGAKey, {
    debug: false,
    gaOptions: {
      siteSpeedSampleRate: 100,
    },
  });

  const logout = () => {
    authService.logout();
    userHasAuthenticated(false);
    document.location.href = '/login';
  };

  // Axios interceptors to request
  axios.interceptors.request.use(
    (request) => {
      const skipPaths = ['/api/auth/password/reset', '/api/auth/invite/accept'];
      if (skipPaths.includes(request.url)) {
        return request;
      }

      const idfToken = localStorage.getItem('idftoken');
      if (idfToken) {
        const creds = JSON.parse(idfToken);
        const expirationTime = new Date(creds.expires);
        const diff = moment(expirationTime).diff(moment()) - 5; // get difference 5 milliseconds before
        if (diff <= 0) {
          // TODO: Define if is necessary a message with the details of the logout flow after session expires
          logout();
        }
      }

      return request;
    },
    (err) => err
  );

  // Axios interceptors to response
  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.status === 401) {
        // TODO: Define if is necessary a message with the details of the logout flow after session expires
        logout();
      }
      return err;
    }
  );

  useEffect(() => {
    const onLoad = async () => {
      try {
        const user = authService.getCurrentUser();
        userHasAuthenticated(!!user);
      } catch (e) {
        if (e !== 'No current user') {
          alert(e);
        }
      }
    };

    onLoad();
  }, [userHasAuthenticated]);

  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
};

export default App;
