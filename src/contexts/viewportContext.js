import React, { createContext, useContext, useEffect, useState } from 'react';

const ViewportContext = createContext({
  width: window.innerWidth,
});
export const ViewportProvider = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <ViewportContext.Provider value={{ width }}>
      {children}
    </ViewportContext.Provider>
  );
};
export function useViewport() {
  return useContext(ViewportContext);
}
