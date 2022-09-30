import React, { useState, useEffect } from 'react';

const Heading = ({
  title,
  children,
  showGreeting,
  icon,
  pageHeaderDivider = 'page-header-divider mb-3',
}) => {
  const [greeting, setGreeting] = useState(title);
  const [isSideIcon, setIsSideIcon] = useState(icon);
  useEffect(() => {
    setGreeting(title);
    setIsSideIcon(icon);
  }, [title]);

  return (
    <>
      {(children || showGreeting) && (
        <div
          className={`page-header pb-2 ${
            !showGreeting ? 'mb-0' : `${pageHeaderDivider}`
          }`}
        >
          <div className="row align-items-end">
            <div className="col-sm mb-2 mb-sm-0">
              {showGreeting && (
                <h1 className="page-header-title">
                  {' '}
                  <span className="material-icons-outlined mx-1">
                    {isSideIcon}
                  </span>{' '}
                  {greeting}
                </h1>
              )}
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Heading.defaultProps = {
  showGreeting: true,
};

export default Heading;
