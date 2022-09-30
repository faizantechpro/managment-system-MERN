import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import Avatar from './Avatar';
import IdfAdditionalOwnersListDropdown from './idfComponents/idfAdditionalOwners/IdfAdditionalOwnersListDropdown';

const AvatarFilter = ({
  dispatch,
  filtersItems,
  onHandleFilterContact,
  property,
  users = [],
  mainUser,
  refresh,
  setRefresh,
  maxUsers = 5,
  defaultSize,
  allowDelete = false,
  isClickable = true,
  padding = 'py-2',
}) => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [clicked, setClicked] = useState([]);

  const tooltipText = (profile) => {
    if (profile.external) {
      return <p>{`${profile.email}`}</p>;
    }

    const user = property ? profile[property] : profile;
    if (user.first_name) {
      return (
        <p>{`${user.first_name} ${user.last_name ? user.last_name : ''} ${
          user.title ? `- ${user.title}` : ''
        }`}</p>
      );
    }
    return <p>{`${user.email} ${user.title ? `- ${user.title}` : ''}`}</p>;
  };

  const onHandleSelect = (item) => {
    dispatch({
      type: 'set',
      input: filtersItems[0].name,
      payload: item.name || item.id,
    });
  };

  const getData = (users) => {
    const AllUsers = [
      mainUser,
      ...users.filter((usr) => {
        return usr.id !== mainUser.id;
      }),
    ];
    const AllUsersData = [
      ...AllUsers?.map((usr) => {
        return { user: usr, user_id: usr.id };
      }),
    ];
    setAllUsers(AllUsers);
    setData(AllUsersData);
    setCount(data.length);
  };

  useEffect(() => {
    getData(users);
  }, []);

  useEffect(() => {
    setCount(data.length);
  }, [data]);

  const FilterOnClick = (profile, i) => {
    setClicked((nums) =>
      nums.includes(i) ? nums.filter((n) => n !== i) : [i, ...nums]
    );
    onHandleSelect(profile);
    onHandleFilterContact(profile);
  };

  useEffect(() => {
    if (refresh) setClicked([]);
    setRefresh(false);
  }, [refresh]);

  return (
    <>
      <div className={`align-items-end more-owners ml-2 ${padding}`}>
        {allUsers?.map((profile, i) =>
          i < maxUsers ? (
            <OverlayTrigger
              key={`${profile[property]?.id || profile.id} ${i}`}
              placement="bottom"
              overlay={
                <Tooltip
                  id={`tooltip-${profile[property]?.id || profile.id}`}
                  className={`tooltip-profile font-weight-bold`}
                >
                  {tooltipText(profile)}
                </Tooltip>
              }
            >
              <div>
                {isClickable || allowDelete ? (
                  <div
                    className={`tr-hover cursor-pointer d-flex align-items-end section-owners-header`}
                    onClick={() => {
                      FilterOnClick(profile, i);
                    }}
                  >
                    <Avatar
                      classModifiers={`avatar-md ${i === 0 ? 'mr-1' : 'mr-n2'}`}
                      user={profile[property] || profile}
                      defaultSize={defaultSize}
                      style={{
                        border: `${
                          clicked && clicked.includes(i) ? '2px solid blue' : ''
                        }`,
                      }}
                    />
                  </div>
                ) : (
                  <Avatar
                    classModifiers={`avatar-md mr-n2`}
                    user={profile[property] || profile}
                    defaultSize={defaultSize}
                    style={{
                      border: `${
                        clicked && clicked.includes(i) ? '2px solid blue' : ''
                      }`,
                    }}
                  />
                )}
              </div>
            </OverlayTrigger>
          ) : null
        )}
      </div>
      <div className={padding}>
        {maxUsers < count && (
          <IdfAdditionalOwnersListDropdown
            maxOwners={maxUsers}
            defaultSize={defaultSize}
            prevalue={10}
            prevalueCount={count}
            preOwners={data.slice(maxUsers, count)}
            onCLick={FilterOnClick}
            filteredIcons={true}
            clicked={clicked}
          />
        )}
      </div>
    </>
  );
};

export default AvatarFilter;
