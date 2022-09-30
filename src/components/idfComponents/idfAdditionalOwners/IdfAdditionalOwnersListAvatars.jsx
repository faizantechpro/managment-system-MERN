import { useEffect, useState } from 'react';

import IdfAdditionalOwnersListDropdown from './IdfAdditionalOwnersListDropdown';
import IdfAddOwner from './IdfAddOwner';
import IdfListAvatars from './IdfListAvatars';
import './IdfAdditionalOwners.css';

const IdfAdditionalOwnersListAvatars = ({
  service,
  serviceId,
  maxOwners = 2,
  mainOwner,
  refreshOwners,
  defaultSize = 'sm',
  withoutRequest = false,
  listOwners = [],
  setRefresOwners,
  isprincipalowner: isPrincipalOwner,
  preowners: preOwners,
  small,
  prevalue,
  setPreOwners,
  allowDelete = false,
  isClickable = true,
  ...props
}) => {
  const [owners, setOwners] = useState(listOwners);
  const [count, setCount] = useState(0);
  const [openAddOwner, setOpenAddOwner] = useState(false);

  useEffect(() => {
    if (prevalue && preOwners) {
      setCount(preOwners?.length);
      setOwners(preOwners);
    }
  }, [preOwners]);

  useEffect(() => {
    if (!prevalue) {
      if (serviceId && !withoutRequest) onGetOwners();
      else setCount(listOwners?.length);
    }
  }, [serviceId, refreshOwners]);

  const ownersService = async (pagination) => {
    return await service
      .getOwners(serviceId, pagination)
      .catch((err) => console.log(err));
  };

  const onGetOwners = async () => {
    const resp = await ownersService({ page: 1, limit: 20 });

    const {
      data,
      pagination: { count },
    } = resp || {};

    setOwners(data);
    setCount(count);
  };

  const onAddPerson = (e) => {
    e.preventDefault();

    setOpenAddOwner(true);
  };

  const onSetPreOwners = (values) => {
    setOwners(values);
    setPreOwners(values);
    setCount(values.length);
  };

  return (
    <>
      <IdfListAvatars
        users={owners}
        setUsers={onSetPreOwners}
        property="user"
        defaultSize={defaultSize}
        sizeIcon={props.sizeIcon}
        isClickable={isClickable}
        maxUsers={maxOwners}
        allowDelete={allowDelete}
      />
      {count > maxOwners && (
        <IdfAdditionalOwnersListDropdown
          service={service}
          serviceId={serviceId}
          maxOwners={maxOwners}
          mainOwner={mainOwner}
          refreshOwners={refreshOwners}
          defaultSize={defaultSize}
          withoutRequest={withoutRequest}
          className={withoutRequest ? 'pl-1' : ''}
          setRefresOwners={setRefresOwners}
          prevalue={prevalue}
          prevalueCount={count}
          preOwners={preOwners}
        />
      )}
      {!withoutRequest && isPrincipalOwner ? (
        <IdfAddOwner
          openModal={openAddOwner}
          setOpenModal={setOpenAddOwner}
          service={service}
          serviceId={serviceId}
          onGetOwners={onGetOwners}
          mainOwner={mainOwner}
          setRefresOwners={setRefresOwners}
          owners={owners}
          onSetPreOwners={onSetPreOwners}
          prevalue={prevalue}
          {...props}
        >
          <div className="ml-3">
            <button
              className="btn btn-icon btn-sm btn-ghost-primary rounded-circle"
              style={{ width: small && '25px', height: small && '25px' }}
              onClick={onAddPerson}
            >
              <i className="material-icons-outlined">person_add_alt</i>
            </button>
          </div>
        </IdfAddOwner>
      ) : null}
    </>
  );
};

export default IdfAdditionalOwnersListAvatars;
