import { useContext, createContext, useState } from 'react';

export const ProfileContext = createContext({
  profileInfo: {},
  setProfileInfo: () => null,
});

export const ProfileProvider = (props) => {
  const [profileInfo, setProfileInfo] = useState();

  return (
    <ProfileContext.Provider value={{ profileInfo, setProfileInfo }}>
      {props.children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  return useContext(ProfileContext);
};
