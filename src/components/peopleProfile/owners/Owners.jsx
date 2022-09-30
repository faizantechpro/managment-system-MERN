import { useEffect, useState, useRef } from 'react';

import AddOwner from './AddOwner';
import ViewAllOwners from './ViewAllOwners';
import contactService from '../../../services/contact.service';
import AlertWrapper from '../../Alert/AlertWrapper';
import Alert from '../../Alert/Alert';
import ContactOwnerList from './ContactOwnerList';
import organizationService from '../../../services/organization.service';
import dealService from '../../../services/deal.service';
import EmptyDataButton from '../../emptyDataButton/EmptyDataButton';

const services = {
  organization: organizationService,
  contact: contactService,
  deal: dealService,
};

const Owners = ({
  id,
  ownerService,
  contactOwners,
  onGetContactOwners,
  openAllOwners,
  setOpenAllOwners,
  count,
  flagAddOwner = false,
  mainOwner,
}) => {
  const isMounted = useRef(false);

  const [openModal, setOpenModal] = useState(flagAddOwner);
  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isMounted.current) setOpenModal(true);
    else isMounted.current = true;
  }, [flagAddOwner]);

  const onRemove = async (owner) => {
    try {
      const response = await services[ownerService].removeOwner(
        id,
        owner.user_id
      );

      if (response.data?.message) {
        return setErrorMessage(response.data?.message);
      }
      onGetContactOwners();
    } catch (error) {
      if (error.message) {
        return setErrorMessage(error.message);
      }
      return setErrorMessage(error);
    }
  };

  return (
    <div className="card mt-4 mb-4">
      <div className="card-header">
        <h4 className="card-title">Additional Owners</h4>
        {count !== 0 && (
          <div className="ml-auto">
            <button
              className="btn btn-icon btn-sm btn-ghost-primary rounded-circle"
              onClick={() => setOpenModal(true)}
            >
              <i className="material-icons-outlined">add</i>
            </button>
          </div>
        )}
      </div>

      <div className="card-body py-2">
        {!contactOwners?.length ? (
          <EmptyDataButton
            setOpenModal={setOpenModal}
            message=""
            buttonLabel="Add Additional Owners"
          />
        ) : (
          contactOwners?.map((item) => (
            <ContactOwnerList
              key={item.user_id}
              item={item}
              handleRemove={() => onRemove(item)}
            />
          ))
        )}
        {count > 5 && (
          <button
            className="btn btn-white btn-sm"
            onClick={() => setOpenAllOwners(true)}
          >
            View all
            <span className="material-icons-outlined">chevron_right</span>
          </button>
        )}
      </div>

      <AddOwner
        id={id}
        openModal={openModal}
        setOpenModal={setOpenModal}
        contactOwners={contactOwners}
        mainOwner={mainOwner}
        setErrorMessage={setErrorMessage}
        setSuccessMessage={setSuccessMessage}
        ownerService={ownerService}
        onGetContactOwners={onGetContactOwners}
        services={services}
      />

      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
      </AlertWrapper>

      <ViewAllOwners
        openAllOwners={openAllOwners}
        setOpenAllOwners={setOpenAllOwners}
        count={count}
        mainOwner={mainOwner}
        onRemove={onRemove}
        id={id}
      />
    </div>
  );
};

export default Owners;
