import { useEffect, useState } from 'react';
import avatarService from '../services/avatar.service';
import DefaultAvatar from './DefaultAvatar';
import { isValidUrl } from '../utils/Utils';

const Avatar = ({
  user = {},
  active = false,
  classModifiers = '',
  defaultSize = 'sm',
  type = 'contact',
  sizeIcon,
  style,
}) => {
  const [avatar, setAvatar] = useState();

  const getAvatarUrl = async () => {
    try {
      // for profiles that are imported via RR, currently this looks working,
      // TODO: will upload these public urls to s3 and load it
      if (user?.avatar && isValidUrl(user?.avatar)) {
        setAvatar(user.avatar);
      } else {
        const avatar = await avatarService.getAvatarMemo(user?.avatar);
        if (avatar) {
          setAvatar(avatar.url);
        } else {
          setAvatar(null);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (user?.avatar) {
      getAvatarUrl();
    } else {
      setAvatar(null);
    }
  }, [user?.avatar]);

  if (!avatar && !user?.avatarSrc) {
    return (
      <DefaultAvatar
        active={active}
        classModifiers={classModifiers}
        defaultSize={defaultSize}
        type={type}
        sizeIcon={sizeIcon}
        style={style}
      />
    );
  } else {
    return (
      <div
        className={`avatar avatar-${defaultSize} avatar-circle ${classModifiers}`}
        style={style}
      >
        <img
          className="avatar-img"
          src={user?.avatarSrc || avatar}
          alt="Avatar"
        />
        {active && (
          <span
            className={`avatar-status avatar-${defaultSize}-status avatar-status-success`}
          />
        )}
      </div>
    );
  }
};

export default Avatar;
