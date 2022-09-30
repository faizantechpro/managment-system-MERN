import { createContext, useState } from 'react';

export const AlertMessageContext = createContext({
  successMessage: null,
  errorMessage: null,
  setSuccessMessage: () => null,
  setErrorMessage: () => null,
});

export const AlertMessageProvider = (props) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <AlertMessageContext.Provider
      value={{
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
      }}
    >
      {props.children}
    </AlertMessageContext.Provider>
  );
};
