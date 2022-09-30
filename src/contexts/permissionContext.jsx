import { createContext, useState } from 'react';

export const PermissionsContext = createContext({
  permissionChanges: false,
  setPermissionChanges: () => null,
});

export const PermissionsProvider = (props) => {
  const [permissionChanges, setPermissionChanges] = useState(false);

  return (
    <PermissionsContext.Provider
      value={{ permissionChanges, setPermissionChanges }}
    >
      {props.children}
    </PermissionsContext.Provider>
  );
};
