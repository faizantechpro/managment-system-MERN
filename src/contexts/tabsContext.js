import { useState, createContext } from 'react';

export const TabsContext = createContext({
  activatedTab: null,
  setActivatedTab: () => null,
});

export const TabsProvider = (props) => {
  const [activatedTab, setActivatedTab] = useState({});

  return (
    <TabsContext.Provider value={{ activatedTab, setActivatedTab }}>
      {props.children}
    </TabsContext.Provider>
  );
};
