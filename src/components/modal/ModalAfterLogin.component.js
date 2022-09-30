import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import WistiaEmbed from '../wistia';
import { TenantContext } from '../../contexts/TenantContext';

function ModalAfterLogin() {
  const history = useHistory();
  const { tenant } = useContext(TenantContext);
  let media = {};

  if (tenant.settings?.first_time_media) {
    media = tenant.settings?.first_time_media;
  }

  const [showModal, setShowModal] = useState(true);

  function onHandleCloseModal() {
    localStorage.setItem('showModal', true);
    history.push('/');
    setShowModal(false);
  }

  const closeBtn = (
    <button
      className="close"
      style={{ fontSize: '30px' }}
      onClick={onHandleCloseModal}
    >
      &times;
    </button>
  );

  return (
    <Modal isOpen={showModal} fade={false} size="lg">
      <ModalHeader tag="h2" close={closeBtn}>
        {media && media.title ? media.title : 'Welcome to Identifee'}
      </ModalHeader>
      <ModalBody>
        {media && media.src && media.type === 'img' ? (
          <img src={media.src} style={{ width: '100%' }} />
        ) : (
          <WistiaEmbed
            hashedId={process.env.REACT_APP_FIRST_TIME_USER || 'oko87x4g0y'}
          />
        )}
      </ModalBody>
    </Modal>
  );
}

export default ModalAfterLogin;
