import { useState, createContext } from 'react';

export const ToggleMenuContext = createContext({
  isOpen: false,
  setOpen: () => null,
});

export const ToggleMenuProvider = (props) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <ToggleMenuContext.Provider value={{ isOpen, setOpen }}>
      {props.children}
    </ToggleMenuContext.Provider>
  );
};
