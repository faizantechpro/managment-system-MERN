import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

import { API } from '../services/api';
import Heading from '../components/heading';
import Alert from '../components/Alert/Alert';
import {
  DEFAULT_LANGUAGE,
  UPDATE_PROFILE,
  SERVER_ERROR,
  SUCCESS_INFO,
  LOGIN_INFO,
  CHANGE_LOGIN_INFO,
  UPLOAD_ERROR,
  TIMEZONE_DESCRIPTION,
} from '../utils/constants';
import stringConstants from '../utils/stringConstants.json';
import { useProfileContext } from '../contexts/profileContext';
import Avatar from '../components/Avatar';
import userService from '../services/user.service';
import FormItem from '../components/profile/FormItem';
import Loading from '../components/Loading';
import ModalAvatar from '../components/modal/ModalAvatar';
import filesService from '../services/files.service';
import { base64ToBlob } from '../utils/Utils';
import AlertWrapper from '../components/Alert/AlertWrapper';
import IdfDropdownSearch from '../components/idfComponents/idfDropdown/IdfDropdownSearch';

const timezone = `(${moment
  .parseZone(moment().format())
  .format('Z')}) ${moment.tz.guess()}`;

function Profile() {
  const api = new API();
  const userInputs = stringConstants.users.inputs;
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const { setProfileInfo } = useProfileContext();
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '1 631-860-5659',
    email: '',
    title: '',
    language: DEFAULT_LANGUAGE,
    datetimeFormat: DEFAULT_LANGUAGE,
    timezone: '', // timeZone.value
    currency: 'USD',
  });
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [openModalAvatar, setOpenModalAvatar] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function getUser() {
      setFirstLoading(true);
      const response = await api.GetUserInfo();

      const {
        id,
        first_name: firstName,
        last_name: lastName,
        email,
        avatar,
        title,
        phone,
      } = response || {};

      setUserInfo({
        id,
        firstName,
        lastName,
        email,
        avatar,
        title,
        phone,
      });

      setFirstLoading(false);
    }

    getUser();
  }, []);

  const onHandleSaveAvatar = async ({ src, name }) => {
    setLoadingAvatar(true);
    const form = new FormData();
    form.append('file', await base64ToBlob(src), name);
    const avatarResult = await userService.uploadAvatar(form).catch((_) => {
      setErrorMessage(UPLOAD_ERROR);
    });
    const result = avatarResult?.data;

    setProfileInfo((prev) => ({
      ...prev,
      avatar: result.data.id,
      avatarSrc: src,
    }));

    setUserInfo((prev) => ({
      ...prev,
      avatar: result.data.id,
      avatarSrc: src,
    }));

    if (result?.data?.id) {
      await updateAvatarUser(result.data.id);
      setLoadingAvatar(false);
    }
  };

  function onHandleChange(e) {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const userInfoBody = { ...userInfo };

    const resp = await userService
      .updateUserInfo(userInfoBody)
      .catch((err) => console.log(err));

    if (!resp) {
      setErrorMessage(SERVER_ERROR);
    } else {
      setSuccessMessage(SUCCESS_INFO);
    }

    setLoading(false);
    setProfileInfo((prev) => ({
      ...prev,
      first_name: userInfoBody.firstName,
      last_name: userInfoBody.lastName,
    }));
  };

  const updateAvatarUser = async (avatarId) => {
    const response = await api.GetUserInfo();

    const {
      id,
      first_name: firstName,
      last_name: lastName,
      email,
      title,
      phone,
    } = response || {};

    const dataSend = {
      id,
      first_name: firstName,
      last_name: lastName,
      email,
      avatar: avatarId,
      title,
      phone,
    };

    const resp = await userService
      .updateUserInfo(dataSend)
      .catch((err) => console.log(err));

    if (!resp) {
      setErrorMessage(SERVER_ERROR);
    } else {
      setSuccessMessage(SUCCESS_INFO);
    }
    setOpenModalAvatar(false);
  };

  const removeFile = async () => {
    setLoadingAvatar(true);
    filesService
      .removeFileById(userInfo.avatar)
      .then(() => {
        updateAvatarUser(null);

        setProfileInfo((prev) => ({
          ...prev,
          avatar: null,
          avatarSrc: null,
        }));

        setUserInfo((prev) => ({
          ...prev,
          avatar: null,
          avatarSrc: null,
        }));
        setLoadingAvatar(false);
      })
      .catch(() => {
        setErrorMessage('error');
      });
  };

  return (
    <>
      <Heading title="Profile" useBc />
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

      <ModalAvatar
        open={openModalAvatar}
        onHandleClose={() => setOpenModalAvatar(false)}
        userInfo={userInfo}
        onRemove={removeFile}
        loading={loadingAvatar}
        onSaveAvatar={onHandleSaveAvatar}
        type="profile"
      />
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card mb-3 mb-lg-5">
            <div className="card-header">
              <h2 className="card-title h4" data-uw-styling-context="true">
                General
              </h2>
            </div>

            {firstLoading && <Loading />}

            {!firstLoading && (
              <div className="card-body">
                <FormItem title="Profile Photo">
                  <div
                    className="input-group input-group-sm-down-break"
                    onClick={() => setOpenModalAvatar(true)}
                  >
                    <label htmlFor="avatar">
                      <div className="edit-avatar-container">
                        <Avatar user={userInfo} classModifiers="max-wh" />
                        <div className="edit-avatar-icon">
                          <i className="material-icons-outlined">edit</i>
                        </div>
                      </div>
                    </label>
                  </div>
                </FormItem>
                <form onSubmit={onHandleSubmit}>
                  <FormItem
                    title={userInputs.fullName.title}
                    labelFor="firstNameLabel"
                  >
                    <div className="input-group input-group-sm-down-break ">
                      <input
                        type="text"
                        className="form-control mr-2 "
                        name="firstName"
                        id="firstNameLabel"
                        placeholder={`${userInputs.fullName.placeholderName}`}
                        aria-label={`${userInputs.fullName.placeholderName}`}
                        value={userInfo.firstName}
                        data-uw-styling-context="true"
                        onChange={onHandleChange}
                      />
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        id="lastNameLabel"
                        placeholder={`${userInputs.fullName.placeholderLastName}`}
                        aria-label={`${userInputs.fullName.placeholderLastName}`}
                        value={userInfo.lastName}
                        data-uw-styling-context="true"
                        onChange={onHandleChange}
                      />
                    </div>
                  </FormItem>

                  <FormItem
                    title={userInputs.title.title}
                    labelFor="titleLabel"
                  >
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      id="titleLabel"
                      placeholder={userInputs.title.placeholder}
                      aria-label={userInputs.title.placeholder}
                      value={userInfo.title}
                      data-uw-styling-context="true"
                      onChange={onHandleChange}
                    />
                  </FormItem>

                  <FormItem
                    title={userInputs.phoneNumber.title}
                    labelFor="phoneLabel"
                  >
                    <input
                      type="number"
                      className="form-control"
                      name="phone"
                      id="phoneLabel"
                      placeholder={userInputs.phoneNumber.placeholder}
                      aria-label={userInputs.phoneNumber.placeholder}
                      value={userInfo.phone}
                      data-uw-styling-context="true"
                      onChange={onHandleChange}
                    />
                  </FormItem>

                  <FormItem
                    title={userInputs.email.title}
                    labelFor="emailLabel"
                  >
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="emailLabel"
                      placeholder={userInputs.email.placeholder}
                      aria-label={userInputs.email.placeholder}
                      disabled={true}
                      value={userInfo.email}
                      data-uw-styling-context="true"
                      onChange={onHandleChange}
                    />
                  </FormItem>

                  <FormItem title="Timezone">
                    <IdfDropdownSearch
                      id="timezone"
                      className="mt-2"
                      name="timezone"
                      showAvatar={false}
                      data={[]}
                      value={timezone}
                      disabled
                    />
                    <span>{TIMEZONE_DESCRIPTION}</span>
                  </FormItem>

                  <FormItem>
                    <p className="mb-0">{LOGIN_INFO}</p>
                    <Link to="/settings/security">{CHANGE_LOGIN_INFO}</Link>
                  </FormItem>

                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-uw-styling-context="true"
                    >
                      {loading ? <Spinner /> : UPDATE_PROFILE}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
