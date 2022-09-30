import { useEffect, useState } from 'react';

import './GlobalSearch.css';
import searchService from '../../services/search.service';
import { GlobalSearchMain } from './GlobalSearchMain';
import { GlobalSearchInput } from './GlobalSearchInput';
import { GlobalSearchResults } from './GlobalSearchResults';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';

export const GlobalSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState({ message: '', color: '' });
  const [loading, setLoading] = useState(false);

  const termFinder = () => {
    setLoading(true);
    searchService
      .getSearchResults({ s: searchValue })
      .then((response) => {
        setLoading(false);
        setSearchResults(response?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    searchValue && searchValue.length >= 3 && termFinder();
  }, [searchValue]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'; // When search result popup opened remove scroll from bottom window to make popup scoll smooth
    } else {
      // removing style attribute because if we set is to unset, when any modal opens user was able to scroll page
      document.body.removeAttribute('style');
    }
  }, [show]);

  return (
    <>
      <GlobalSearchMain autoClose={false} show={show} setShow={setShow}>
        <GlobalSearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          show={show}
          setShow={setShow}
          loading={loading}
          setLoading={setLoading}
        />
        <GlobalSearchResults
          searchValue={searchValue}
          searchResults={searchResults}
          setToast={setToast}
        />
        <AlertWrapper>
          <Alert
            message={toast.message}
            color={toast.color}
            setMessage={setToast}
          />
        </AlertWrapper>
      </GlobalSearchMain>
    </>
  );
};
