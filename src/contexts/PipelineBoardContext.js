import { useContext, createContext, useState } from 'react';

export const PipelineBoardContext = createContext({
  stages: [],
  setStages: () => null,
});

export const PipelineBoardProvider = (props) => {
  const [stages, setStages] = useState([]);

  return (
    <PipelineBoardContext.Provider value={{ stages, setStages }}>
      {props.children}
    </PipelineBoardContext.Provider>
  );
};

export function usePipelineBoardContext() {
  return useContext(PipelineBoardContext);
}
