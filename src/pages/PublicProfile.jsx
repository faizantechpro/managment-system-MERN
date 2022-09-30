import React from 'react';
import { PublicSidebar } from '../components/PublicSideBar';

import Profile from '../views/PublicProfile/Profile';

const PublicProfile = () => {
  return (
    <>
      <div className="row mx-0 px-md-0 public_profile">
        <div className="col-lg-2 px-0">
          <PublicSidebar className="d-lg-block d-none" />
        </div>
        <div className="col-lg-10 my-5 pt-lg-4">
          <Profile />
        </div>
      </div>
    </>
  );
};

export default PublicProfile;
