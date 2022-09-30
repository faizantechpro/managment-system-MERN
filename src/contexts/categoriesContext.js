import { useState, createContext } from 'react';

export const CategoriesContext = createContext({
  categoryList: [],
  setCategoryList: () => null,
  refresh: 1,
  setRefresh: () => null,
});

export const CategoriesProvider = (props) => {
  const [categoryList, setCategoryList] = useState([]);
  const [refresh, setRefresh] = useState(1);
  return (
    <CategoriesContext.Provider
      value={{ categoryList, setCategoryList, refresh, setRefresh }}
    >
      {props.children}
    </CategoriesContext.Provider>
  );
};
