import React, { createContext, useContext, useEffect, useState } from 'react';

export const TenantContext = createContext({
  tenant: {},
  setTenant: () => null,
});

export const TenantProvider = (props) => {
  const [tenant, setTenant] = useState({ id: 'root' }); // TODO: Change with the real default state value

  useEffect(() => {
    fetch(`/env`)
      .then((res) => res.json())
      .then((data) => {
        setTenant(data);
      });
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {props.children}
    </TenantContext.Provider>
  );
};

export const useTenantContext = () => {
  return useContext(TenantContext);
};
