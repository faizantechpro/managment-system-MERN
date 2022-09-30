import { useState, useRef } from 'react';

import useOutsideClick from '../../hooks/useOutsideClick';
import { dropdownOptions } from '../../utils/constants';

export default function DownloadFile() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const usersExportDropdownRef = useRef(null);

  useOutsideClick(usersExportDropdownRef, setDropdownOpen);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const toogleClassName = dropdownOpen ? '' : 'hs-unfold-hidden';

  return (
    <div className="hs-unfold mr-2">
      <div
        className="js-hs-unfold-invoker btn btn-sm btn-white dropdown-toggle"
        data-uw-styling-context="true"
        onClick={toggle}
        ref={usersExportDropdownRef}
      >
        <i
          className="material-icons-outlined mr-1"
          data-uw-styling-context="true"
        >
          file_download
        </i>
        Export
      </div>

      <div
        id="usersExportDropdown"
        className={`hs-unfold-content dropdown-unfold dropdown-menu dropdown-menu-sm-right ${toogleClassName} hs-unfold-content-initialized hs-unfold-css-animation animated animation-duration-3`}
        data-hs-target-height="275"
      >
        {dropdownOptions?.map((option) => (
          <div key={option.id}>
            {option.divider && <div className="dropdown-divider" />}
            <div
              id={option.id}
              className={option.className}
              data-uw-styling-context="true"
            >
              {option.img && (
                <img
                  className="avatar avatar-xss avatar-4by3 mr-2"
                  src={option.img.src}
                  alt={option.img.alt}
                />
              )}
              <span>{option.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
