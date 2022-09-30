import { Dropdown } from 'react-bootstrap';

export const GlobalSearchMain = ({ autoClose, children, show, setShow }) => {
  const autoCloseHandler = (isOpen, event, metadata) => {
    if (metadata.source !== 'select') {
      setShow(isOpen);
    }
  };

  const toogleHandler = autoClose ? autoCloseHandler : () => {};

  return (
    <Dropdown
      onToggle={toogleHandler}
      show={show}
      className="global-search-dropdown"
    >
      {children}
    </Dropdown>
  );
};
