import { useContext } from 'react';

import IdfPrincipalOwnerAvatar from './IdfPrincipalOwnerAvatar';
import IdfAdditionalOwnersListAvatars from './IdfAdditionalOwnersListAvatars';
import AlertWrapper from '../../Alert/AlertWrapper';
import Alert from '../../Alert/Alert';
import { AlertMessageContext } from '../../../contexts/AlertMessageContext';
import './IdfAdditionalOwners.css';

const IdfOwnersHeader = (props) => {
  const { successMessage, setSuccessMessage, errorMessage, setErrorMessage } =
    useContext(AlertMessageContext);

  return (
    <>
      <div className="d-flex align-items-end section-owners-header">
        <IdfPrincipalOwnerAvatar
          mainOwner={props.me}
          {...props}
          isClickable={props.isClickable}
        />

        <IdfAdditionalOwnersListAvatars
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
          allowDelete={props.allowDelete}
          mainOwner={props.me}
          isClickable={props.isClickable}
          {...props}
        />
      </div>

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
    </>
  );
};

export default IdfOwnersHeader;
