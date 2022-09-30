import React from 'react';
import Avatar from '../Avatar';
import routes from '../../utils/routes.json';
import MaterialIcon from '../commons/MaterialIcon';

const ContactItem = ({ icon, text }) => {
  return (
    <>
      <p className="m-0 px-0 lead py-1 fs-7 d-flex align-items-center">
        <div
          className="bg-gray-300 rounded-circle text-center"
          style={{ height: 24, width: 24 }}
        >
          <MaterialIcon icon={icon} clazz="font-size-md" />
        </div>
        <p className="mb-0 text-nowrap ml-1">{text}</p>
      </p>
    </>
  );
};

// this component is specific to show profile like in figma design when hover/click user-name in Followers/Additional Owners sections
export default function PopoverProfile({ user, Route, contact, orgName }) {
  return (
    <div className="p-2">
      <div className="profile-popover d-flex">
        <div
          className="avatar avatar-sm avatar-circle mr-3"
          onClick={() => {
            window.location.href = Route;
          }}
        >
          <Avatar user={user} />
        </div>
        <div className="pr-2 flex-grow-1">
          <h5 className="mb-0">
            <a
              href={`${routes.contacts}/${user.id}/profile`}
              className="text-block popover-link"
            >
              {user.first_name} {user.last_name}
            </a>
          </h5>
          <p className="text-muted font-weight-normal text-nowrap mb-0">
            {user.description || ' '}
          </p>
          {(user.email || user.email_work) && (
            <ContactItem icon="mail" text={user.email || user.email_work} />
          )}
          {user.phone_work && (
            <ContactItem icon="phone" text={user.phone_work} />
          )}
          {user.title && <ContactItem icon="title" text={user.title} />}
          {contact && orgName && <ContactItem icon="business" text={orgName} />}
        </div>
      </div>
    </div>
  );
}
