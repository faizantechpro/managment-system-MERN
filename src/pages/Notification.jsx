import React from 'react';

import Heading from '../components/heading';
import NotificationForm from '../components/notification/NotificationForm';

const Notification = () => {
  return (
    <>
      <Heading title="Notification" useBc />
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <NotificationForm />
        </div>
      </div>
    </>
  );
};

export default Notification;
