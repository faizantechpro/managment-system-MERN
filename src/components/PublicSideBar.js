import React from 'react';

export const PublicSidebar = () => {
  return (
    <>
      <div className="public-sidebar">
        <div className="inner-content">
          <span className="material-icons-outlined account-balance">
            account_balance
          </span>
          <h2>EXCEL BANK</h2>
          <h5>YOUR BANK REP</h5>
          <img src="/img/public_profile.png" />
          <h3>
            Antonio Davis
            <span className="material-icons-outlined ml-2">info</span>
          </h3>
          <div className="mt-5 pt-4">
            <button className="btn btn-outline-dark w-100 mt-2">
              <span className="material-icons-outlined mr-2">call</span> Request
              a Call
            </button>
            <button className="btn btn-outline-dark w-100 mt-2">
              <span className="material-icons-outlined mr-2">group</span> Your
              Bank Team
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
