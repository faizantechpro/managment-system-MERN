import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import moment from 'moment';
import { Calendar } from 'react-date-range';
import { TimePickerComponent } from '@syncfusion/ej2-react-calendars';

import Avatar from '../Avatar';

const scheduleCallExtraOptions = [
  {
    id: 'schedule-option-1',
    icon: 'schedule',
    description: '30 minute meeting',
  },
  {
    id: 'schedule-option-2',
    icon: 'place',
    description: 'Web conferencing details provided upon confirmation',
  },
];

const ScheduleCallForm = ({ data, dateTime, setDateTime }) => {
  const [scheduleCallOptions, setScheduleCallOptions] = useState(
    scheduleCallExtraOptions
  );
  const primaryOwnerContact = `${data?.first_name} ${data?.last_name}`;

  useEffect(() => {
    if (data?.phone) {
      const newScheduleOptions = [
        ...scheduleCallOptions,
        { id: 'schedule-option-3', icon: 'call', description: data?.phone },
      ];

      setScheduleCallOptions(newScheduleOptions);
    }
  }, [data]);

  const changeTime = ({ value }) => {
    if (value) {
      setDateTime({
        ...dateTime,
        time: moment(value).format('hh:mm'),
      });
    }
  };

  return (
    <Row>
      <Col>
        <Row className="mb-4">
          <Col xs="auto" className="m-auto">
            <Avatar user={data} classModifiers="avatar-xl" />
          </Col>
          <Col>
            <h4 className="mb-0 font-weight-bolder">
              <a href="/deals/contacts/people/profile/" className="text-block">
                {primaryOwnerContact}
              </a>
            </h4>

            <span className="text-muted font-size-sm font-weight-medium my-3">
              {data?.title}
            </span>
            <span className="d-block text-muted font-size-sm">
              {data?.email}
            </span>
          </Col>
        </Row>

        {scheduleCallExtraOptions?.map((option) => (
          <Row key={option.id}>
            <Col>
              <div className="media mb-4">
                <i className="material-icons-outlined font-size-xxl mr-2">
                  {option.icon}
                </i>
                <div className="media-body">
                  <span className="d-block text-dark font-weight-medium">
                    {option.description}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        ))}
      </Col>

      <Col className="border-left">
        <Row className="font-weight-bold">
          <Col>
            <h4 data-uw-styling-context="true">Select a date &amp; time</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Calendar
                onChange={(item) =>
                  setDateTime({
                    ...dateTime,
                    date: item,
                  })
                }
                date={dateTime.date}
              />
              <TimePickerComponent
                cssClass="e-custom-style"
                openOnFocus={true}
                value={dateTime.time}
                placeholder="Select Time"
                onChange={changeTime}
                step={5}
              />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ScheduleCallForm;
