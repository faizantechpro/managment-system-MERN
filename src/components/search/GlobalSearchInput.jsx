import { forwardRef, useState } from 'react';
import {
  Button,
  Dropdown,
  Form,
  FormControl,
  InputGroup,
  Spinner,
} from 'react-bootstrap';

export const GlobalSearchInput = ({
  searchValue,
  setSearchValue,
  show,
  setShow,
  loading,
  setLoading,
}) => (
  <Dropdown.Toggle
    as={CustomSearchInput}
    searchValue={searchValue}
    setSearchValue={setSearchValue}
    show={show}
    setShow={setShow}
    loading={loading}
    setLoading={setLoading}
  />
);

const CustomSearchInput = forwardRef(
  (
    { show, setShow, searchValue, setSearchValue, loading, setLoading },
    ref
  ) => {
    const [inputHover, setInputHover] = useState(false);

    const clearInput = () => {
      closeDropdown();
      setSearchValue('');
    };

    const closeDropdown = () => {
      setShow(false);
    };

    const openDropdown = () => {
      setShow(true);
    };

    const inputClickHandler = (e) => {
      const { value } = e.target;
      value.length >= 3 && !show && setShow(true);
    };

    const inputValueHandler = (e) => {
      e.preventDefault();
      const { value } = e.target;
      setSearchValue(value);

      value.length >= 3 ? !show && openDropdown(e) : show && closeDropdown(e);
    };

    const inputFocus = () => {
      const input = document.getElementById('global-search-input');
      input.focus();
    };

    const addHover = () => setInputHover(true);
    const removeHover = () => setInputHover(false);

    return (
      <>
        <SearchForm onMouseOver={addHover} onMouseOut={removeHover}>
          {loading ? <SearchSpinner /> : <SearchButton onClick={inputFocus} />}
          <SearchInput
            ref={ref}
            inputHover={inputHover}
            value={searchValue}
            onChange={inputValueHandler}
            onClick={inputClickHandler}
          />
          <ResetButton onClick={clearInput} show={show} />
        </SearchForm>
        <BackDrop onClick={closeDropdown} show={show} />
      </>
    );
  }
);

CustomSearchInput.displayName = 'CustomSearchInput';

const SearchForm = ({ onMouseOut, onMouseOver, children }) => (
  <Form className="global-search search-fixed">
    <InputGroup size="sm" onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      {children}
    </InputGroup>
  </Form>
);

const SearchButton = ({ onClick }) => (
  <InputGroup.Text role="button" onClick={onClick} className="border-0 pr-0">
    <span className="material-icons-outlined">search</span>
  </InputGroup.Text>
);

const SearchSpinner = () => (
  <InputGroup.Text role="span" className="border-0 pl-3 pr-0">
    <Spinner animation="border" size="sm" variant="primary" />
  </InputGroup.Text>
);

const SearchInput = forwardRef(
  ({ inputHover, value, onChange, onClick }, ref) => (
    <FormControl
      id="global-search-input"
      ref={ref}
      aria-label="Search"
      className={`border-0 search-input ${inputHover ? 'search-hover' : ''}`}
      placeholder="Search"
      value={value}
      onChange={onChange}
      onClick={onClick}
    />
  )
);

SearchInput.displayName = 'SearchInput';

const BackDrop = ({ onClick, show }) =>
  show && <div className="search-dropdown-backdrop" onClick={onClick}></div>;

const ResetButton = ({ onClick, show }) =>
  show && (
    <Button
      variant="link"
      className="border-0 pl-0"
      size="sm"
      onClick={onClick}
    >
      <span className="material-icons-outlined search-close">close</span>
    </Button>
  );
