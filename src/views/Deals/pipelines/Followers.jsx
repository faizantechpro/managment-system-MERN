import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../../components/Avatar';
import FollowersModal from '../../../components/modal/FollowersModal';
import dealService from '../../../services/deal.service';
import { useProfileContext } from '../../../contexts/profileContext';
import stringConstants from '../../../utils/stringConstants.json';
import routes from '../../../utils/routes.json';

const constants = stringConstants.followers;

const Followers = ({ dealId }) => {
  const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersInfo, setFollowersInfo] = useState([]);
  const { profileInfo } = useProfileContext();

  const getFollowers = async () => {
    const result = await dealService.getFollowers(dealId, {});
    setFollowersInfo(result?.data);
  };

  const stopFollowing = async () => {
    await dealService.stopFollowing(dealId, userId);
    await getFollowers();
  };

  const startFollowing = async () => {
    await dealService.startFollowing(dealId, userId);
    await getFollowers();
  };

  const checkFollower = async () => {
    const result = await dealService.checkFollowing(dealId, userId);
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
        dealId={dealId}
        userId={userId}
      />
      <div className="card-header">
        <h4 className="card-title">{constants.followers}</h4>
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
          {(!followersInfo || followersInfo.length === 0) && <div>None</div>}
          {followersInfo &&
            followersInfo.map((item) => (
              <div
                key={`${item.user_id}-${item.deal_id}`}
                className="list-group-item"
              >
                <div className="media">
                  <div className="avatar avatar-sm avatar-circle mr-3">
                    <Avatar user={item.user} />
                  </div>
                  <div className="media-body">
                    <h5 className="mb-0">
                      <Link
                        className="text-block"
                        to={`${routes.usersProfile}/${item.user.id}`}
                      >
                        {item.user.first_name} {item.user.last_name}
                      </Link>
                    </h5>
                    {item.user.title && (
                      <span className="text-muted font-size-sm font-weight-medium mt-1">
                        {item.user.title}
                      </span>
                    )}
                    <span className="d-block text-muted font-size-sm">
                      {item.user.email}
                    </span>
                  </div>
                </div>
              </div>
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
            {constants.viewAll}
            <span className="material-icons-outlined">chevron_right</span>
          </button>
        )}
        {isFollowing ? (
          <button className="btn btn-white btn-sm ml-2" onClick={stopFollowing}>
            <span className="material-icons-outlined mr-1">block</span>
            {constants.stopFollowing}
          </button>
        ) : (
          <button
            className="btn btn-white btn-sm ml-2"
            onClick={startFollowing}
          >
            <span className="material-icons-outlined mr-1">add</span>
            {constants.startFollowing}
          </button>
        )}
      </div>
    </div>
  );
};

export default Followers;
