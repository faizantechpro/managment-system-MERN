import { useState, useEffect, useRef } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';

import './ActivitiesHistory.css';
import AddActivity from '../peopleProfile/contentFeed/AddActivity';
import Activity from '../steps/Activity';
import stringConstants from '../../utils/stringConstants.json';

const ActivitiesHistory = ({
  className,
  icon,
  contactId,
  organizationId,
  dealId,
  limit = 3,
  response,
  activities = [],
}) => {
  const withoutActivities = 'activities-without-activities';
  const activitiesPlanned = 'activities-planned';
  const activitiesOverdue = 'activities-overdue';
  const constants = stringConstants.deals.contacts.profile;
  const isMounted = useRef(false);
  const [showModalActivity, setShowModalActivity] = useState(false);
  const [title, setTitle] = useState(constants.withoutPlanned);
  const [btn, setBtn] = useState(null);
  const [currentFeed, setCurrentFeed] = useState(null);

  const confirm = (msg) => {
    setShowModalActivity(false);
    response(msg);
  };

  useEffect(() => {
    const el = document.getElementById(`btn-${dealId}`);
    el.classList.add(withoutActivities);
    setBtn(el);
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      if (activities.length) {
        for (let i = 0; i < activities.length; i++) {
          const activity = activities[i];
          if (new Date(activity.start_date) < new Date()) {
            setTitle(constants.overdue);
            btn.classList.replace(withoutActivities, activitiesOverdue);
            break;
          } else if (
            new Date(activity.start_date).getDay() === new Date().getDay()
          ) {
            if (new Date(activity.start_date) >= new Date()) {
              setTitle(constants.today);
              btn.classList.replace(withoutActivities, activitiesPlanned);
              break;
            }
          } else if (i === activities.length - 1) {
            if (constants.today !== title) {
              setTitle(constants.planned);
              btn.classList.replace(withoutActivities, activitiesPlanned);
              break;
            }
          }
        }
      }
    } else isMounted.current = true;
  }, [activities, isMounted.current]);

  const onHandleShowEditActivity = (data) => {
    setCurrentFeed(data);
    setShowModalActivity(true);
  };

  return (
    <div className="activities-btn">
      <Dropdown>
        <Dropdown.Toggle
          id={`btn-${dealId}`}
          className={'btn-ghost-secondary dropdown-hide-arrow'}
          style={{ border: 0 }}
        >
          <span className={className}>{icon}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className={'modal-history-activities'}>
          <div>
            {activities.length
              ? activities.map((item, i) => {
                  if (i < limit) {
                    return (
                      <Activity
                        key={item.id}
                        data={item}
                        confirm={confirm}
                        onHandleEdit={onHandleShowEditActivity}
                      />
                    );
                  } else return null;
                })
              : null}
          </div>
          <div className="schedule">
            <button
              className="btn btn-light px-1 rounded btn-block w-100"
              onClick={() => {
                setCurrentFeed(null);
                setShowModalActivity(true);
              }}
            >
              <span className={className}>{'add'}</span>
              {constants.scheduleActivity}
            </button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <Modal
        animation={false}
        show={showModalActivity}
        onHide={() => {
          setShowModalActivity(false);
        }}
        className="modal-create-activity"
        size={'lg'}
      >
        <Modal.Header closeButton />
        <AddActivity
          organizationId={organizationId}
          dealId={dealId}
          contactIs={'organization'}
          getProfileInfo={confirm}
          isModal={true}
          feedInfo={currentFeed}
          feedId={currentFeed?.feed_id}
          activityData={currentFeed?.feed?.object_data}
          closeModal={() => setShowModalActivity(false)}
        />
      </Modal>
    </div>
  );
};

export default ActivitiesHistory;
