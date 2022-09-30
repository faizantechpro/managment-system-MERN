import React, { useState, useEffect } from 'react';

import Alert from '../../Alert/Alert';
import AlertWrapper from '../../Alert/AlertWrapper';
import IdfAllAdditionalOwnersList from '../../idfComponents/idfAdditionalOwners/IdfAllAdditionalOwnersList';
import IdfAddOwner from '../../idfComponents/idfAdditionalOwners/IdfAddOwner';
import ContactOwnerList from '../owners/ContactOwnerList';
import contactService from '../../../services/contact.service';
import { useProfileContext } from '../../../contexts/profileContext';

const Followers = ({ contactId, mainOwner, isPrincipalOwner }) => {
  const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [openAddFollower, setOpenAddFollower] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(true);
  const [followersInfo, setFollowersInfo] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { profileInfo } = useProfileContext();

  const getFollowers = async () => {
    return await contactService
      .getFollowers(contactId, {})
      .catch((err) => console.log(err));
  };

  const stopFollowing = async () => {
    await contactService
      .stopFollowing(contactId, userId)
      .catch((err) => console.log(err));
    await onGetOwners();
  };

  const startFollowing = async () => {
    await contactService
      .startFollowing(contactId, userId)
      .catch((err) => console.log(err));
    await onGetOwners();
  };

  const checkFollower = async () => {
    const result = await contactService.checkFollowing(contactId, userId);
    const IsOwner =
      followersInfo.filter((follower) => {
        return follower.user_id === userId && follower.user.type !== 'follower';
      }).length > 0;

    setIsOwner(IsOwner);
    setIsFollowing(result);
  };

  const getUserId = () => {
    const id = profileInfo?.id;
    if (id) {
      setUserId(id);
    }
  };

  useEffect(() => {
    onGetOwners();
  }, []);

  useEffect(() => {
    if (!openAddFollower) onGetOwners();
  }, [isFollowing, openAddFollower]);

  useEffect(() => {
    if (userId) {
      checkFollower();
    }
  }, [userId, followersInfo]);

  useEffect(() => {
    getUserId();
  }, [profileInfo]);

  const putItemsFirst = ({ findFunction, array }) => [
    ...array.filter(findFunction),
    ...array.filter((item) => !findFunction(item)),
  ];

  useEffect(() => {
    setFollowersInfo([
      ...putItemsFirst({
        array: [...followersInfo],
        findFunction: (rc) => {
          return rc.user?.id === mainOwner?.assigned_user_id;
        },
      }),
    ]);
  }, [mainOwner]);

  useEffect(() => {
    if (
      mainOwner &&
      (followersInfo.length === 0 ||
        followersInfo[0].user_id !== mainOwner?.assigned_user_id)
    ) {
      setFollowersInfo([
        {
          user_id: mainOwner?.assigned_user_id,
          contact_id: contactId,
          user: { ...mainOwner?.assigned_user, type: 'primaryOwner' },
        },
        ...followersInfo,
      ]);
    }
  }, [followersInfo]);

  const getOwners = async (pagination) => {
    return await contactService
      .getOwners(contactId, pagination)
      .catch((err) => console.log(err));
  };

  const onAdded = (followerSelected) => {
    const newFollower = {
      user_id: followerSelected.id,
      user: { ...followerSelected, type: 'owner' },
    };
    const updatedFollowers = [...followersInfo];
    updatedFollowers.push(newFollower);
    setFollowersInfo(updatedFollowers);
  };

  const onGetOwners = async (pagination = { page: 1, limit: 10 }) => {
    const requests = [];
    requests.push(getOwners(pagination));
    requests.push(getFollowers());
    const resp = await Promise.all(requests);
    const owners = resp[0];

    const { data } = owners || {};

    const contacts = resp[1].data || [];
    const ownersList = data.map((ow) => ({
      ...ow,
      user: { ...ow.user, type: 'owner' },
    }));
    const contactsList =
      (contacts &&
        contacts.map((fo) => ({
          ...fo,
          user: { ...fo.user, type: 'follower' },
        }))) ||
      [];
    setFollowersInfo([...ownersList, ...contactsList]);
  };

  return (
    <div className="card mt-4">
      <IdfAllAdditionalOwnersList
        openAllOwners={showModal}
        setOpenAllOwners={setShowModal}
        service={contactService}
        serviceId={contactId}
        count={followersInfo.length}
        onGetOwners={onGetOwners}
        owners={followersInfo}
        isPrincipalOwner={isPrincipalOwner}
      />
      <div className="card-header">
        <h4 className="card-title">Followers</h4>
        <IdfAddOwner
          openModal={openAddFollower}
          setOpenModal={setOpenAddFollower}
          service={contactService}
          serviceId={contactId}
          onGetOwners={onGetOwners}
          owners={followersInfo}
          onAdded={onAdded}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
        >
          <div className="ml-auto">
            <button
              className="btn btn-icon btn-sm btn-ghost-primary rounded-circle"
              onClick={() => {
                setOpenAddFollower(true);
              }}
            >
              <i className="material-icons-outlined">add</i>
            </button>
          </div>
        </IdfAddOwner>
      </div>

      <div className="card-body py-2">
        <div className="align-items-center justify-content-between">
          {followersInfo && followersInfo.length === 0 && (
            <div className="pl-1 py-3 m-auto">There are no followers</div>
          )}
          {followersInfo &&
            followersInfo.slice(0, 5).map((item) => {
              return (
                <ContactOwnerList
                  key={item.user_id}
                  item={item}
                  mainOwner={mainOwner.assigned_user}
                  isPrincipalOwner={isPrincipalOwner}
                />
              );
            })}
        </div>
      </div>

      <div className="card-footer">
        {followersInfo && followersInfo.length > 0 && (
          <button
            className="btn btn-white btn-sm"
            onClick={() => {
              setShowModal(true);
            }}
          >
            View all
            <span className="material-icons-outlined">chevron_right</span>
          </button>
        )}
        {isOwner || isFollowing ? (
          <button
            className={`btn btn-white btn-sm ml-2 ${isOwner ? 'disabled' : ''}`}
            onClick={!isOwner ? stopFollowing : () => {}}
          >
            <span className="material-icons-outlined mr-1">block</span>
            Stop following
          </button>
        ) : (
          <button
            className="btn btn-white btn-sm ml-2"
            onClick={startFollowing}
          >
            <span className="material-icons-outlined mr-1">add</span>
            Start following
          </button>
        )}
      </div>
      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
      </AlertWrapper>
    </div>
  );
};

export default Followers;
