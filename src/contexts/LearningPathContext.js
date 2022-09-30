import { useState, createContext } from 'react';

export const LearningPathContext = createContext({
  learningList: [],
  setLearningList: () => null,
});

export const LearningPathProvider = (props) => {
  const [learningList, setLearningList] = useState([]);

  return (
    <LearningPathContext.Provider value={{ learningList, setLearningList }}>
      {props.children}
    </LearningPathContext.Provider>
  );
};
