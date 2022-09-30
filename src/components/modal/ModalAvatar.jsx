import React, { useEffect, useRef, useState } from 'react';
import { Modal, ModalBody, Row, Col, ModalHeader } from 'reactstrap';
import Cropper from 'react-cropper';

import 'cropperjs/dist/cropper.css';
import constants from '../../utils/stringConstants.json';
import Avatar from '../Avatar';
import ButtonIcon from '../commons/ButtonIcon';
import CategoryPartnerLogo from '../lesson/CategoryPartnerLogo';
import avatarService from '../../services/avatar.service';

const TYPE_CONTROL = {
  update: 'UPDATE',
  save: 'SAVE',
  change: 'CHANGE',
};

const commons = constants.global.commons;
const avatarString = constants.global.avatar;

const ModalAvatar = ({
  open,
  onHandleClose,
  colorButtonCancel = 'primary',
  loading,
  userInfo,
  onSaveAvatar,
  onRemove,
  type = 'organization',
  previewFile,
}) => {
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [control, setControl] = useState(TYPE_CONTROL.update);
  const [preview, setPreview] = useState(false);

  const ref = useRef(null);
  const [cropper, setCropper] = useState(undefined);
  const [image, setImage] = useState(undefined);

  const onHandleChangeFile = () => {
    if (cropper?.getCroppedCanvas()) {
      setEdit(false);
      setControl(TYPE_CONTROL.save);
      setData((prev) => ({
        ...prev,
        avatarSrc: cropper
          .getCroppedCanvas({ maxWidth: 512, maxHeight: 512 })
          .toDataURL(),
        file: {
          src: image.src,
          name: image.name,
        },
      }));

      if (previewFile) {
        setPreview(
          cropper
            .getCroppedCanvas({ maxWidth: 512, maxHeight: 512 })
            .toDataURL()
        );
      }
    }
  };

  const onSave = () => {
    onSaveAvatar({ file: data.file, src: data.avatarSrc });
  };

  const onHandleCloseModal = () => {
    setEdit(false);
    setData((prev) => ({ ...prev, avatarSrc: null }));
    setImage('');
    setControl(userInfo.avatar ? TYPE_CONTROL.change : TYPE_CONTROL.update);
    onHandleClose();
  };

  useEffect(async () => {
    setData(userInfo);
    setControl(
      userInfo.avatar || userInfo.avatarSrc
        ? TYPE_CONTROL.change
        : TYPE_CONTROL.update
    );
    if (type === 'Partner' || type === 'Partner Icon') {
      if (previewFile && userInfo.avatarSrc) {
        const logo = await avatarService.getAvatarMemo(userInfo.avatarSrc);
        if (logo) {
          setImage(logo);
        }
      }
    }
  }, [userInfo]);

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage((prev) => ({
          ...prev,
          url: reader.result,
          name: files[0].name,
          type: files[0].type,
        }));
      };

      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <Modal
      isOpen={open}
      toggle={onHandleCloseModal}
      fade={false}
      className="modal-avatar-upload"
    >
      <ModalHeader toggle={onHandleCloseModal} />
      <ModalBody className="mt-0 pt-0">
        <Row>
          <Col xs={12}>
            <span className="fw-bold">
              <span className="text-capitalize">{type}</span> Logo
            </span>
            <p className="text-muted">
              The logo of the {type} helps you and your team to recognize it
              easily
            </p>
          </Col>

          <Col xs={12}>
            <hr className="dropdown-divider" />
          </Col>

          {!edit && (
            <Col xs={12} className={` text-center my-4`}>
              {type === 'Partner' || type === 'Partner Icon' ? (
                <>
                  {previewFile && preview ? (
                    <img
                      src={preview}
                      style={{ objectFit: 'contain', width: 210 }}
                    />
                  ) : (
                    <CategoryPartnerLogo
                      categoryInfo={{ logo: userInfo?.avatarSrc }}
                      imageStyle="avatar-size-modal"
                      preview={true}
                    />
                  )}
                </>
              ) : (
                <Avatar
                  classModifiers="avatar-size-modal"
                  user={data}
                  type={type !== 'organization' ? 'contact' : type}
                  sizeIcon="size-icon-avatar"
                />
              )}
            </Col>
          )}
          {edit && (
            <Col xs={12} className={`d-flex justify-content-center my-6`}>
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg, image/jpg"
                onChange={onChange}
                style={{ display: 'none' }}
                ref={ref}
              />
              <Row className="w-100" noGutters>
                <Col xs={12}>
                  <Cropper
                    style={{
                      height: 300,
                      width: '100%',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                    }}
                    zoomTo={1}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={image?.url}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive
                    autoCropArea={1}
                    checkOrientation={false}
                    onInitialized={(instance) => {
                      setCropper(instance);
                    }}
                    guides={true}
                  />
                </Col>
                <Col xs={12} className="d-flex justify-content-end mt-2">
                  <ButtonIcon
                    onclick={() => ref.current.click()}
                    label={'Upload Image'}
                    color={'outline-primary'}
                    classnames="btn-sm"
                  />
                  <ButtonIcon
                    onclick={onHandleChangeFile}
                    label={'Apply'}
                    color={'outline-primary'}
                    classnames="btn-sm ml-2"
                    disabled={!image}
                  />
                </Col>
              </Row>
            </Col>
          )}

          <Col xs={12} className="d-flex justify-content-end">
            {control === TYPE_CONTROL.update && (
              <ButtonIcon
                onclick={() => setEdit(true)}
                label={edit ? commons.save : avatarString.uploadLabel}
                color={colorButtonCancel}
                classnames="btn-sm"
                disabled={loading}
              />
            )}

            {control === TYPE_CONTROL.save && (
              <ButtonIcon
                onclick={onSave}
                label={commons.save}
                color={colorButtonCancel}
                classnames="btn-sm"
                loading={loading}
                disabled={loading}
              />
            )}

            {control === TYPE_CONTROL.change && (
              <div className="w-100 d-flex justify-content-center">
                <ButtonIcon
                  onclick={onRemove}
                  label={commons.remove}
                  icon="delete"
                  color="outline-danger"
                  classnames="btn-sm w-49"
                  loading={loading}
                  disabled={loading}
                />
                {edit === false && (
                  <ButtonIcon
                    onclick={() => setEdit(true)}
                    label={commons.change}
                    color={colorButtonCancel}
                    classnames="btn-sm ml-1 w-49"
                  />
                )}
              </div>
            )}
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ModalAvatar;
