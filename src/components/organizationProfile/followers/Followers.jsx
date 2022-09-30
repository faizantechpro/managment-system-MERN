import React, { useState, useEffect } from 'react';
import FollowersModal from '../../modal/FollowersModal';
import organizationService from '../../../services/organization.service';
import { useProfileContext } from '../../../contexts/profileContext';
import ProfileCardItem from '../../peopleProfile/ProfileCardItem';

const Followers = ({ organizationId }) => {
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersInfo, setFollowersInfo] = useState([]);
  const { profileInfo } = useProfileContext();

  const getFollowers = async () => {
    const result = await organizationService.getFollowers(organizationId, {});
    setFollowersInfo(result?.data);
  };

  const stopFollowing = async () => {
    await organizationService.stopFollowing(organizationId, userId);
    await getFollowers();
  };

  const startFollowing = async () => {
    await organizationService.startFollowing(organizationId, userId);
    await getFollowers();
  };

  const checkFollower = async () => {
    const result = await organizationService.checkFollowing(
      organizationId,
      userId
    );
    setIsFollowing(result);
  };

  const getUserId = () => {
    const id = profileInfo?.id;
    if (id) {
      setUserId(id);
    }
  };

  useEffect(() => {
    getFollowers();
  }, []);

  useEffect(() => {
    if (userId) {
      checkFollower();
    }
  }, [userId, followersInfo]);

  useEffect(() => {
    getUserId();
  }, [profileInfo]);

  return (
    <div className="card mt-4">
      <FollowersModal
        showModal={showModal}
        setShowModal={setShowModal}
        organizationId={organizationId}
        userId={userId}
      />
      <div className="card-header">
        <h4 className="card-title">Followers</h4>
        <div className="ml-auto">
          <button
            className="btn btn-icon btn-sm btn-ghost-primary rounded-circle"
            onClick={() => {
              if (isFollowing) {
                stopFollowing();
              } else {
                startFollowing();
              }
            }}
          >
            <i className="material-icons-outlined">
              {isFollowing ? 'remove' : 'add'}
            </i>
          </button>
        </div>
      </div>

      <div className="card-body py-2">
        <div className="list-group list-group-lg list-group-flush list-group-no-gutters">
          {followersInfo.length === 0 && <div>None</div>}
          {followersInfo.map((item, idx) => (
            <ProfileCardItem key={idx} user={item.user} />
          ))}
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
        {isFollowing ? (
          <button className="btn btn-white btn-sm ml-2" onClick={stopFollowing}>
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
    </div>
  );
};

export default Followers;
