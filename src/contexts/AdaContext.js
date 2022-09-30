import React, { createContext } from 'react';

(function (d) {
  const s = d.createElement('script');
  s.setAttribute('data-account', process.env.REACT_APP_ADA || 'I1ArcXw1pZ');
  (d.body || d.head).appendChild(s);
})(document);

export const AdaContext = createContext();

export const AdaProvider = (props) => {
  const { children } = props;

  return <AdaContext.Provider value={{}}>{children}</AdaContext.Provider>;
};
