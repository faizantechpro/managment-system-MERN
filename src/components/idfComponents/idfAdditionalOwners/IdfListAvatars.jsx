import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Avatar from '../../Avatar';
import routes from '../../../utils/routes.json';

const IdfListAvatars = ({
  property,
  users = [],
  setUsers,
  maxUsers = 5,
  defaultSize,
  sizeIcon,
  allowDelete = false,
  isClickable = true,
}) => {
  const tooltipText = (profile) => {
    if (profile.external) {
      return <p>{`${profile.email}`}</p>;
    }

    const user = property ? profile[property] : profile;
    return (
      <p>{`${user.first_name} ${user.last_name} ${
        user.title ? `- ${user.title}` : ''
      }`}</p>
    );
  };

  const handleClick = (e, profile) => {
    // if this flag is on and if the user is listed in the users list then clicking again remove it from list
    if (allowDelete) {
      e.preventDefault();
      if (setUsers) {
        setUsers([...users.filter((user) => user.user_id !== profile.user_id)]);
      }
    }
  };

  return (
    <div className="align-items-end more-owners ml-2">
      {users?.map((profile, i) =>
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
              {' '}
              {isClickable || allowDelete ? (
                <Link
                  className="d-flex mx-n1/4"
                  onClick={(e) => handleClick(e, profile)}
                  to={
                    profile.external
                      ? '#'
                      : `${routes.usersProfile}/${
                          profile[property]?.id || profile.id
                        }`
                  }
                >
                  <Avatar
                    classModifiers={`avatar-md mr-n2`}
                    user={profile[property] || profile}
                    defaultSize={defaultSize}
                    sizeIcon={sizeIcon}
                  />
                </Link>
              ) : (
                <Link className="d-flex mx-n1/4 cursor-default">
                  <Avatar
                    classModifiers={`avatar-md mr-n2`}
                    user={profile[property] || profile}
                    defaultSize={defaultSize}
                    sizeIcon={sizeIcon}
                  />
                </Link>
              )}
            </div>
          </OverlayTrigger>
        ) : null
      )}
    </div>
  );
};

export default IdfListAvatars;
