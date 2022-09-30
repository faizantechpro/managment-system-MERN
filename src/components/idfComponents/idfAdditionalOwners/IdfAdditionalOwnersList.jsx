import { useEffect, useState } from 'react';

import ContactOwnerList from '../../peopleProfile/owners/ContactOwnerList';
import IdfAddOwner from './IdfAddOwner';
import IdfAllAdditionalOwnersList from './IdfAllAdditionalOwnersList';
import stringConstants from '../../../utils/stringConstants.json';
import { useProfileContext } from '../../../contexts/profileContext';
import organizationService from '../../../services/organization.service';

const constants = stringConstants.deals.contacts;

const IdfAdditionalOwnersList = ({ service, serviceId, ...props }) => {
  const {
    refreshOwners,
    setRefresOwners,
    isPrincipalOwner,
    withFollowers,
    mainOwner,
  } = props;

  const [owners, setOwners] = useState([]);
  const [count, setCount] = useState(0);
  const [openAddOwner, setOpenAddOwner] = useState(false);
  const [openAllOwners, setOpenAllOwners] = useState(false);
  const [followersInfo, setFollowersInfo] = useState([]);
  const [userId, setUserId] = useState('');
  const { profileInfo } = useProfileContext();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(true);

  const getUserId = () => {
    const id = profileInfo?.id;
    if (id) {
      setUserId(id);
    }
  };

  useEffect(() => {
    if (serviceId) onGetOwners();
  }, [serviceId, refreshOwners, isFollowing]);

  const ownersService = async (pagination) => {
    return await service
      .getOwners(serviceId, pagination)
      .catch((err) => console.log(err));
  };

  // this function takes the find function and put the item to first index in array if found
  const putItemsFirst = ({ findFunction, array }) => [
    ...array.filter(findFunction),
    ...array.filter((item) => !findFunction(item)),
  ];

  useEffect(() => {
    // placing primary owner to start of follower section
    setOwners([
      ...putItemsFirst({
        array: [...owners],
        findFunction: (rc) => {
          return rc.user?.id === props.mainOwner?.id;
        },
      }),
    ]);
  }, [mainOwner]);

  useEffect(() => {
    if (
      mainOwner &&
      (owners.length === 0 || owners[0].user_id !== mainOwner?.id)
    ) {
      setOwners([
        {
          organization_id: withFollowers,
          user: { ...mainOwner, type: 'primaryOwner' },
          user_id: mainOwner?.id,
        },
        ...owners,
      ]);
    }
  }, [owners]);

  const checkFollower = async () => {
    const result = await organizationService.checkFollowing(serviceId, userId);
    const IsOwner =
      owners.filter((owner) => {
        return owner.user_id === userId && owner.user.type !== 'follower';
      }).length > 0;
    setIsOwner(IsOwner);
    setIsFollowing(result);
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

  const onGetOwners = async (pagination = { page: 1, limit: 10 }) => {
    const requests = [];
    requests.push(ownersService(pagination));
    if (withFollowers) {
      // withFollowers should contain id of organization so that we get its followers only
      requests.push(organizationService.getFollowers(withFollowers, {}));
    }
    const resp = await Promise.all(requests); // ownersService(pagination);
    const owners = resp[0];

    const {
      data,
      pagination: { count },
    } = owners || {};

    const contacts = withFollowers && (resp[1].data || []);
    // to show icon, we need to add a property to distinguish between owners and followers
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
    setOwners([...ownersList, ...contactsList]);
    setCount(count);
  };

  // this method is passing as props below so that we get the selected owner and add in array to avoid owners api call again
  const onAdded = (ownerSelected) => {
    const newOwner = {
      user_id: ownerSelected.id,
      user: { ...ownerSelected, type: 'owner' },
    };
    const updatedOwners = [...owners];
    updatedOwners.push(newOwner);
    setOwners(updatedOwners);
  };

  const getFollowers = async () => {
    const result = await organizationService.getFollowers(serviceId, {});
    setFollowersInfo(result?.data);
  };

  const stopFollowing = async () => {
    await organizationService.stopFollowing(serviceId, userId);
    await getFollowers();
  };

  const startFollowing = async () => {
    await organizationService.startFollowing(serviceId, userId);
    await getFollowers();
  };

  return (
    <div className="card mt-4 mb-4">
      <div className="card-header">
        <h4 className="card-title">Followers</h4>
        {isPrincipalOwner && (
          <IdfAddOwner
            openModal={openAddOwner}
            setOpenModal={setOpenAddOwner}
            service={service}
            serviceId={serviceId}
            onGetOwners={onGetOwners}
            owners={owners}
            setRefresOwners={setRefresOwners}
            onAdded={onAdded}
            {...props}
          >
            <div className="ml-auto">
              <button
                className="btn btn-icon btn-sm btn-ghost-primary rounded-circle"
                onClick={() => setOpenAddOwner(true)}
              >
                <i className="material-icons-outlined">add</i>
              </button>
            </div>
          </IdfAddOwner>
        )}
      </div>
      <div className="card-body py-2">
        {!owners?.length ? (
          <div className="media align-items-center m-auto">
            There are no followers
          </div>
        ) : (
          owners
            ?.slice(0, 5)
            .map((item) => (
              <ContactOwnerList
                key={item.user_id}
                item={item}
                mainOwner={props.mainOwner}
                isPrincipalOwner={isPrincipalOwner}
              />
            ))
        )}
        <IdfAllAdditionalOwnersList
          openAllOwners={openAllOwners}
          setOpenAllOwners={setOpenAllOwners}
          service={service}
          serviceId={serviceId}
          count={count}
          setRefresOwners={setRefresOwners}
          onGetOwners={onGetOwners}
          owners={owners}
          isPrincipalOwner={isPrincipalOwner}
          {...props}
        />
      </div>
      <div className="card-footer">
        {owners?.length > 0 && (
          <button
            className="btn btn-white btn-sm"
            onClick={() => setOpenAllOwners(true)}
          >
            {constants.profile.viewAllLabel}
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
    </div>
  );
};

export default IdfAdditionalOwnersList;
