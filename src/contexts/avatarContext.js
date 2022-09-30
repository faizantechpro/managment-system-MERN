import { useContext, createContext, useState } from 'react';

export const AvatarContext = createContext({
  avatarId: false,
  setAvatarId: () => null,
});

export const AvatarProvider = (props) => {
  const [avatarId, setAvatarId] = useState();

  return (
    <AvatarContext.Provider value={{ avatarId, setAvatarId }}>
      {props.children}
    </AvatarContext.Provider>
  );
};

export const useAvatarContext = () => {
  return useContext(AvatarContext);
};
