import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import './DayGridCalendar.css';

const events = [
  {
    id: 1,
    title: 'event 1',
    start: '2021-06-14T10:00:00',
    end: '2021-06-14T12:00:00',
  },
  {
    id: 2,
    title: 'event 2',
    start: '2021-10-26T13:00:00',
    end: '2021-10-26T18:00:00',
  },
  { id: 3, title: 'event 3', start: '2021-06-17', end: '2021-06-20' },
];

const DayGridCalendar = (dateClick, eventClick) => {
  return (
    <FullCalendar
      allDayClassNames={`all-day-classnames`}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridDay"
      allDaySlot={false}
      events={events}
      eventColor={`#092ace`}
      nowIndicator
      dateClick={(e) => dateClick(e.dateStr)}
      eventClick={(e) => eventClick(e.event.id)}
    />
  );
};

export default DayGridCalendar;
