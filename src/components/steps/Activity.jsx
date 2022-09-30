import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';

import { setDateFormat } from '../../utils/Utils';
import { ACTIVITY_FEED_THEMES } from '../../utils/constants';
import feedService from '../../services/feed.service';
import userService from '../../services/user.service';
import stringConstants from '../../utils/stringConstants.json';
import IdfListAvatars from '../idfComponents/idfAdditionalOwners/IdfListAvatars';
import SubmenuDropdownLink from '../commons/DropdownLink';

const Activity = ({ data, confirm, maxUsers = 4, onHandleEdit }) => {
  const regex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const constants = stringConstants.deals.contacts.profile;
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    const el = document.getElementById(`li-item-date-${data.id}`);
    if (new Date(data?.feed?.object_data.start_date) < new Date()) {
      el.classList.add('activities-overdue');
    } else if (
      new Date(data?.feed?.object_data.start_date).getDay() ===
      new Date().getDay()
    ) {
      el.classList.add('activities-today');
    } else if (new Date(data?.feed?.object_data.start_date) > new Date()) {
      el.classList.add('activities-planned');
    }
  }, []);

  const markAsDone = async (done) => {
    try {
      await feedService.updateActivity({ done, feedId: data?.feed?.id });
      confirm(constants.updatedActivity);
    } catch (error) {
      confirm(constants.errorUpdatedActivity);
    }
  };

  const getUserByIds = async (guests = '') => {
    if (guests === '') {
      return [];
    }

    const guestIds = guests.split(',');
    const result = [];
    const guestUuid = guestIds.filter((guestId) => {
      if (regex.test(guestId)) {
        result.push({
          value: guestId,
          name: guestId,
          email: guestId,
          avatar: '',
          id: guestId,
          external: true,
        });
      }

      return !regex.test(guestId);
    });

    if (guestUuid.length === 0) {
      return setGuests([...result]);
    }
    const { data: response } = await userService.getGuestsByIds(
      guestUuid.toString()
    );

    const otherData = [];

    response?.users?.forEach((user) => {
      const name = `${user.first_name} ${user.last_name}`;
      otherData.push({
        name: name,
        value: name,
        first_name: user.first_name,
        last_name: user.last_name,
        title: user.title,
        email: user.email || user.email_work || user.email_home,
        avatar: user.avatar,
        id: user.id,
        url: `/settings/profile/users/${user.id}`,
      });
    });

    response?.contacts?.forEach((item) => {
      const name = `${item.first_name} ${item.last_name}`;
      otherData.push({
        value: name,
        name: name,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email || item.email_work || item.email_home,
        avatar: item.avatar,
        id: item.id,
        url: `/contacts/${item.id}/profile`,
      });
    });

    setGuests([...otherData, ...result]);
  };

  useEffect(() => {
    if (data.guests) {
      getUserByIds(data?.guests);
    }
  }, [data]);

  return (
    <div>
      <div className="card pb-0 border-0">
        <div className="card-body pb-0 d-flex">
          <div className="info mr-2">
            <h4 className="text-wrap d-flex flex-row align-items-center">
              <div
                className="custom-control custom-control-green custom-radio"
                title="Mark as done"
              >
                <input
                  data-testid={`checkbox-${data.id}`}
                  type="checkbox"
                  className="custom-control-input"
                  id={data.id}
                  checked={data?.done}
                  onChange={() => {
                    markAsDone(!data.done);
                  }}
                />
                <label className="custom-control-label" htmlFor={data.id} />
              </div>
              <span
                className="text-block cursor-pointer"
                onClick={() => onHandleEdit(data)}
              >
                {data.name}
              </span>
            </h4>
            <ul className="list-inline text-muted font-size-xs">
              {data?.feed?.object_data.start_date && (
                <li
                  className="list-inline-item mr-3 align-middle"
                  id={`li-item-date-${data.id}`}
                  data-testid={`li-item-date-${data.id}`}
                >
                  {setDateFormat(
                    data?.feed?.object_data.start_date,
                    'MMM DD YYYY h:mm a'
                  )}
                </li>
              )}
              <li className="list-inline-item mr-4 align-middle">
                <Row>
                  <Col className="col-auto px-1">
                    <IdfListAvatars
                      users={guests}
                      maxUsers={maxUsers}
                      defaultSize={'xs'}
                    />
                  </Col>
                  {guests.length > maxUsers ? (
                    <Col className="px-0">
                      <SubmenuDropdownLink
                        classMenu="menu-guest"
                        id={data.id}
                        data={guests}
                        title={
                          <div className="section-owners-header more-owners">
                            <button
                              className={`btn btn-icon btn-xs btn-ghost-primary rounded-circle`}
                            >
                              <i className="material-icons-outlined">add</i>
                            </button>
                          </div>
                        }
                      />
                    </Col>
                  ) : null}
                </Row>
              </li>
              <li className="list-inline-item align-middle">
                {data?.location?.length
                  ? data.location
                  : data?.conference_link?.length
                  ? data.conference_link
                  : null}
              </li>
            </ul>
          </div>
          <div className="activity-icon">
            {data?.type ? (
              <span
                className={`step-icon ${ACTIVITY_FEED_THEMES[data.type].color}`}
              >
                <i className="material-icons-outlined mr-1">
                  {ACTIVITY_FEED_THEMES[data.type].icon}
                </i>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
