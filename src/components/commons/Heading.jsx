import React, { useState, useEffect } from 'react';

const Heading = ({
  title,
  useBc,
  children,
  showGreeting,
  paddingBottomDefault,
}) => {
  const [greeting, setGreeting] = useState(title);

  useEffect(() => {
    setGreeting(title);
  }, [title]);

  return (
    <div
      className={`page-header ${!paddingBottomDefault ? 'pb-4' : 'pb-0'} ${
        !showGreeting ? 'mb-0' : 'page-header-divider mb-4'
      }`}
    >
      <div className="row align-items-center">
        <div className="col-sm-3 mb-2 mb-sm-0">
          {/* {useBc && (
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-no-gutter">
                <Breadcrumb path={location.pathname} title={title} />
              </ol>
            </nav>
          )} */}
          <h1 className="page-header-title">{greeting}</h1>
        </div>
        <div className="d-flex col-sm-9 align-items-end">{children}</div>
      </div>
    </div>
  );
};

export default Heading;
