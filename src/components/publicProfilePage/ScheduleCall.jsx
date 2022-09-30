import { useState } from 'react';
import moment from 'moment';

import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import SimpleModalCreation from '../modal/SimpleModalCreation';
import ScheduleCallForm from './ScheduleCallForm';
import feedService from '../../services/feed.service';

const ScheduleCall = ({
  children,
  open,
  setOpenScheduleCall,
  data,
  organizationId,
  contactId,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dateTime, setDateTime] = useState({
    date: '',
    time: '',
  });

  const [warningMessage, setWarningMessage] = useState('');

  const onClose = () => {
    setOpenScheduleCall(false);
  };

  const onHandleSubmit = async () => {
    const guests = [data.id];

    const startDate = `${moment(dateTime.date).format('YYYY-MM-DD')} ${
      dateTime.time
    }`;

    await feedService
      .addActivity({
        contact_id: contactId,
        contact_info: data,
        organization_id: organizationId,
        type: 'meetingActivity',
        name: 'Schedule Call',
        start_date: startDate,
        guests: guests.toString() || '',
        location: '',
        conference_link: '',
        description: '',
        free_busy: 'Busy',
        notes: '',
        owner: data.id,
        lead: '',
        done: false,
      })
      .catch(() => setWarningMessage('Invalid Token'));

    setSuccessMessage('Meeting has been created');
    setLoading(false);
    onClose();
  };

  const mouseEventClick = () => document.dispatchEvent(new MouseEvent('click'));

  return (
    <>
      {children}

      <SimpleModalCreation
        modalTitle="Schedule Call"
        open={open}
        handleSubmit={onHandleSubmit}
        onHandleCloseModal={onClose}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        isLoading={loading}
        onClick={mouseEventClick}
        customModal="modal-dialog-custom"
        bodyClassName="mx-2"
        headerClassName="font-weight-bolder"
      >
        <ScheduleCallForm
          data={data}
          dateTime={dateTime}
          setDateTime={setDateTime}
        />
      </SimpleModalCreation>

      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
        <Alert
          color="warning"
          message={warningMessage}
          setMessage={setWarningMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default ScheduleCall;
