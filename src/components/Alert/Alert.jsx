import React, { useEffect } from 'react';
import { Alert as AlertB } from 'reactstrap';

const Alert = ({ message, setMessage, color, icon, time }) => {
  useEffect(() => {
    if (message && ((time && time !== -1) || !time )) {
      // Close alert
      setTimeout(() => {
        setMessage('');
      }, time || 3000);
    }
  }, [message]);

  return (
    <AlertB color={color} isOpen={!!message}>
      {message}
    </AlertB>
  );
};

export default Alert;
