import React, { useEffect, useState } from 'react';
import Avatar from '../Avatar';
import routes from '../../utils/routes.json';
import PopoverWrapper from '../commons/PopoverWrapper';
import PopoverProfile from '../profile/PopoverProfile';
import organizationService from '../../services/organization.service';

// using this component in left layout on organization/people profile in Contacts/Followers/Additional Owners sections
const ProfileCardItem = ({
  user,
  size = 'sm',
  org = false,
  contact = false,
}) => {
  const [orgName, setOrgName] = useState('');

  const Route = org
    ? `${routes.contacts}/${user?.related_organization_id}/organization/profile`
    : `${routes.contacts}/${user.id}/profile`;

  const getOrgById = async (id) => {
    const Org = await organizationService.getOrganizationById(id);
    setOrgName(Org?.name);
  };

  useEffect(() => {
    contact && getOrgById(user?.organization_id);
  }, []);

  return (
    user && (
      <div key={user?.id} className="list-group-item py-0 border-0">
        <div className="media align-items-center py-0">
          <div className="media-body px-3">
            <h5 className="mb-0 ml-0">
              {org ? (
                <a href={Route} className="text-block popover-link">
                  <div className="d-flex align-items-center">
                    <span>{user?.related_organization_name}</span>
                  </div>
                </a>
              ) : (
                <PopoverWrapper
                  template={
                    <PopoverProfile
                      Route={Route}
                      user={user}
                      contact={contact}
                      orgName={orgName}
                    />
                  }
                >
                  <div className="row">
                    <div className="mr-3">
                      <Avatar
                        user={user}
                        type={user.first_name ? 'contact' : 'business'}
                        defaultSize={size}
                      />
                    </div>
                    <a href={Route} className="text-block popover-link">
                      <div className="d-flex align-items-center">
                        <span className="align-items-center">
                          {user?.first_name} {user?.last_name}
                        </span>
                      </div>
                    </a>
                  </div>
                </PopoverWrapper>
              )}
            </h5>
          </div>
        </div>
      </div>
    )
  );
};

export default ProfileCardItem;
