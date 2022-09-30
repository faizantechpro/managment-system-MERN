import React, { createContext, useEffect } from 'react';
import { useAppContext } from './appContext';

export const BeaconContext = createContext();

export const BeaconProvider = (props) => {
  const { children } = props;
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    function getBeacon() {
      // const script = document.createElement('script');
      // script.innerHTML = window.Beacon(
      //   'init',
      //   process.env.REACT_APP_HELP_SCOUT_BEACON
      // );
    }

    getBeacon();
  }, [isAuthenticated]);

  return <BeaconContext.Provider value={{}}>{children}</BeaconContext.Provider>;
};
