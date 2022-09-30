import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import routes from '../../../utils/routes.json';
import { setDateFormat } from '../../../utils/Utils';
import feedService from '../../../services/feed.service';
import stringConstants from '../../../utils/stringConstants.json';
import Alert from '../../Alert/Alert';
import AlertWrapper from '../../Alert/AlertWrapper';
import MoreActions from '../../MoreActions';
import AddActivity from '../../peopleProfile/contentFeed/AddActivity';
import userService from '../../../services/user.service';
import SubmenuDropdownLink from '../../commons/DropdownLink';
import IdfListAvatars from '../../idfComponents/idfAdditionalOwners/IdfListAvatars';
import MentionsInput from '../../mentions/MentionsInput';

export const items = () => {
  return [
    {
      id: 'edit',
      icon: 'edit',
      name: 'Edit',
    },
  ];
};
const maxUsers = 4;

const FeedActivity = ({
  data,
  id,
  getProfileInfo,
  isContact,
  ids,
  deal,
  organization,
  activity_id,
  isOwner,
  feedInfo,
}) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModalActivity, setShowModalActivity] = useState(false);
  const [contactList, setContactList] = useState([]);
  const history = useHistory();

  const constants = stringConstants.deals.contacts.profile;
  const regex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const markAsDone = async (done) => {
    try {
      await feedService.updateActivity({ done, feedId: id });
      setSuccessMessage(constants.updatedActivity);
      getProfileInfo(constants.updatedActivity);
    } catch (error) {
      setErrorMessage(constants.errorUpdatedActivity);
    }
  };

  const checkDate = (done) => {
    const TODAY = moment().clone().startOf('day');
    const TOMORROW = moment().add(1, 'day');

    if (!done) {
      if (new Date(data.start_date) < new Date()) {
        return 'text-danger';
      }
    }

    if (moment(data.start_date, 'YYYY-MM-DDTHH:mm:ssZ').isSame(TODAY, 'd')) {
      return 'text-success';
    }

    if (moment(data.start_date, 'YYYY-MM-DDTHH:mm:ssZ').isSame(TOMORROW, 'd')) {
      return 'text-primary';
    }

    return '';
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
      return setContactList([...result]);
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
        url: `${routes.contacts}/${item.id}/profile`,
      });
    });

    setContactList([...otherData, ...result]);
  };

  useEffect(() => {
    if (id) {
      getUserByIds(data?.guests);
    }
  }, [id, data?.guests]);

  return (
    <div className="card">
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>

      <Modal
        show={showModalActivity}
        onHide={() => {
          setShowModalActivity(false);
        }}
        className="modal-create-activity"
        size={'lg'}
        animation={false}
      >
        <Modal.Header closeButton tag="h2">
          <h2>Edit Activity</h2>
        </Modal.Header>
        <div className="mx-4 mt-2">
          <AddActivity
            feedId={id}
            componentId="edit-activity"
            contactId={ids.contactId}
            organizationId={ids.organizationId}
            dealId={ids.dealId}
            contactIs={!isContact ? 'organization' : 'profile'}
            getProfileInfo={getProfileInfo}
            isModal={true}
            closeModal={() => setShowModalActivity(false)}
            activityData={data}
            feedInfo={feedInfo}
          />
        </div>
      </Modal>

      <div className="card-body d-flex pb-0 pt-3">
        <div className="mr-2 w-100">
          <h4 className="text-wrap d-flex flex-row align-items-center">
            <div className="ml-4" title="Mark as done">
              <input
                type="checkbox"
                className="custom-control-input"
                id={activity_id || data.id}
                checked={data?.done}
                onClick={() => {
                  markAsDone(!data.done);
                }}
              />
              <label
                className="custom-control-label"
                htmlFor={activity_id || data.id}
              />
            </div>

            <span
              className="text-block cursor-pointer"
              onClick={() => setShowModalActivity(true)}
            >
              {data.name}
            </span>
          </h4>
          <ul className="list-inline text-muted font-size-xs">
            {data.start_date && (
              <li className={`list-inline-item ${checkDate(data.done)}`}>
                {checkDate() === 'text-success'
                  ? ` Today ${setDateFormat(data.start_date, 'h:mm A')}`
                  : checkDate() === 'text-primary'
                  ? ` Tomorrow ${setDateFormat(data.start_date, 'h:mm A')}`
                  : setDateFormat(data.start_date, 'MMM DD YYYY h:mm A')}
              </li>
            )}
            {deal && (
              <li
                className="list-inline-item cursor-pointer"
                onClick={() =>
                  history.push(`${routes.dealsPipeline}/${deal.id}`)
                }
              >
                <span className="material-icons-outlined">monetization_on</span>{' '}
                <span className="text-capitalize">{deal.name}</span>
              </li>
            )}

            {data.contact_info && (
              <li
                className="list-inline-item cursor-pointer"
                onClick={() =>
                  history.push(`/contacts/${data.contact_info.id}/profile`)
                }
              >
                <span className="material-icons-outlined">person</span>{' '}
                {data.contact_info.first_name} {data.contact_info.last_name}
              </li>
            )}

            {organization && (
              <li
                className="list-inline-item cursor-pointer mr-4"
                onClick={() =>
                  history.push(
                    `/contacts/${organization.id}/organization/profile`
                  )
                }
              >
                <span className="material-icons-outlined">corporate_fare</span>{' '}
                <span className="text-capitalize">{organization.name}</span>
              </li>
            )}

            <li className="list-inline-item align-middle">
              <Row>
                <Col className="col-auto px-1">
                  <IdfListAvatars
                    users={contactList}
                    maxUsers={maxUsers}
                    defaultSize={'xs'}
                  />
                </Col>
                {contactList.length > maxUsers ? (
                  <Col className="px-0">
                    <SubmenuDropdownLink
                      id={id}
                      data={contactList}
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
          </ul>
        </div>

        {data.id && isOwner && (
          <div className="ml-auto">
            <MoreActions
              items={items()}
              onHandleEdit={() => {
                setShowModalActivity(true);
              }}
            />
          </div>
        )}
      </div>
      <div
        className="w-100 mt-s pl-4 pt-2 rounded"
        style={{ backgroundColor: '#FFF8BC' }}
      >
        <span className="fw-bold">Note:</span>
        {data?.notes && !data?.rich_note ? (
          <p className="mt-1">{data?.notes}</p>
        ) : (
          <div className="pl-0 pt-0 pb-0">
            <MentionsInput
              className="pt-1 pb-0 px-4"
              defaultState={data?.rich_note}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
};

FeedActivity.defaultProps = {
  data: {},
};

export default FeedActivity;
