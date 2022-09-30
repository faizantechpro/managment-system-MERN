import { useEffect } from 'react';

export default function useOutsideClickDropDown(ref, open, setOpen) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (open && ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);
}
