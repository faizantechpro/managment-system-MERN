import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

import routes from '../../../utils/routes.json';
import Avatar from '../../Avatar';
import IdfAllAdditionalOwnersList from './IdfAllAdditionalOwnersList';

const IdfAdditionalOwnersListDropdown = ({
  service,
  serviceId,
  maxOwners,
  maxCount = 9,
  refreshOwners,
  defaultSize = 'sm',
  className = '',
  setRefresOwners,
  prevalueCount,
  prevalue,
  preOwners,
  filteredIcons = false,
  ...props
}) => {
  const [openAllOwners, setOpenAllOwners] = useState(false);
  const [owners, setOwners] = useState([]);
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (prevalue && prevalueCount) {
      setCount(prevalueCount);
      setOwners(preOwners);
    }
  }, [prevalueCount]);

  useEffect(() => {
    if (serviceId) onGetOwners();
  }, [serviceId, refreshOwners]);

  const ownersService = async (pagination) => {
    return await service
      .getOwners(serviceId, pagination)
      .catch((err) => console.log(err));
  };

  const onGetOwners = async () => {
    const resp = await ownersService({ page: 1, limit: 10 });

    const {
      data,
      pagination: { count },
    } = resp || {};

    setOwners(data);
    setCount(count);
  };

  return (
    <Dropdown
      show={show}
      onToggle={(isOpen, event, metadata) => {
        if (metadata.source !== 'select') {
          setShow(isOpen);
        }
      }}
    >
      <Dropdown.Toggle
        className={`btn btn-icon btn-${defaultSize} btn-ghost-primary section-owners-header rounded-circle ${className}`}
      >
        <span
          className={`material-icons-outlined border-0 ${
            defaultSize === 'sm' ? 'fs-6' : ''
          } fs-6`}
        >
          add
        </span>
        <span className={`fw-bold border-0`}>{count - maxOwners}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="border border-1">
        {owners?.slice(2, owners.length).map((owner, i) => (
          <div
            key={owner.user_id}
            onClick={() => {
              props.onCLick
                ? props.onCLick(owner.user, i + maxOwners)
                : (window.location = `${routes.usersProfile}/${owner.user.id}`);
            }}
          >
            <Dropdown.Item
              data-testid={owner.user_id}
              className="d-flex align-items-center"
            >
              <div className="avatar avatar-sm avatar-circle mr-3">
                <Avatar
                  user={owner.user}
                  style={
                    filteredIcons
                      ? {
                          border: `${
                            props.clicked &&
                            props.clicked.includes(i + maxOwners)
                              ? '2px solid blue'
                              : ''
                          }`,
                          padding: '2px',
                        }
                      : {}
                  }
                />
              </div>
              <h5 className="mb-0">
                {owner.user.first_name
                  ? `${owner.user.first_name} ${owner.user.last_name}`
                  : `${owner.user.email}`}
              </h5>
            </Dropdown.Item>
          </div>
        ))}
        {count > maxCount && (
          <IdfAllAdditionalOwnersList
            openAllOwners={openAllOwners}
            setOpenAllOwners={setOpenAllOwners}
            service={service}
            serviceId={serviceId}
            count={count}
            refreshOwners={refreshOwners}
            setRefresOwners={setRefresOwners}
            {...props}
          >
            {filteredIcons || (
              <Dropdown.Item>
                <div onClick={() => setOpenAllOwners(true)}>
                  View all
                  <span className="material-icons-outlined">chevron_right</span>
                </div>
              </Dropdown.Item>
            )}
          </IdfAllAdditionalOwnersList>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default IdfAdditionalOwnersListDropdown;
