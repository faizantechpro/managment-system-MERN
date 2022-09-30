import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Button,
} from 'reactstrap';

import userService from '../../../services/user.service';
import authService from '../../../services/auth.service';
import ButtonIcon from '../../../components/commons/ButtonIcon';
import Avatar from '../../../components/Avatar';
import FormItem from '../../../components/profile/FormItem';
import ModalConfirm from '../../../components/modal/ModalConfirmDefault';
import {
  USER_UPDATE_SUCCESS,
  SERVER_ERROR,
  ERROR_FIRST_NAME_REQUIRED,
  ERROR_LAST_NAME_REQUIRED,
  badgeColorStatus,
  NAME_UNKNOWN_USER,
  SEND_EMAIL_SUCCESS,
  SUSPEND_USER_MESSAGE,
  LABEL_BUTTON_RESEND_INVITATION,
  LABEL_BUTTON_SUSPEND_USER,
  TEXT_INFO_MODAL_SUSPEND,
  USER_SUSPENDED,
  USER_ACTIVE,
  LABEL_BUTTON_ACTIVATE_USER,
  STATUS_ACTIVE,
  STATUS_INVITED,
  STATUS_SUSPENDED,
  NAME_INVITED_USER,
  TEXT_INFO_MODAL_ACTIVE,
} from '../../../utils/constants';
import routes from '../../../utils/routes.json';
import stringConstants from '../../../utils/stringConstants.json';
import { isEmpty, isDefined, pageTitleBeautify } from '../../../utils/Utils';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import Alert from '../../../components/Alert/Alert';
import IdfModalResetPass from '../../../components/idfComponents/idfModals/idfModalResetPass';
import IdfSelectRole from '../../../components/idfComponents/idfDropdown/IdfSelectRole';

const InfoCard = ({ user, onClickResent, loading }) => {
  const Badge = () => {
    const badgeStatus = user?.status
      ? badgeColorStatus.filter((b) => b.status === user?.status.toLowerCase())
      : null;

    let classnames = '';

    if (badgeStatus?.length > 0) {
      const color = badgeStatus[0].color;
      classnames = `bg-${color}`;
    }

    if (user) {
      return (
        <span className={`badge rounded-pill px-3 py-2 fw-bold ${classnames}`}>
          {user?.status?.toUpperCase()}
        </span>
      );
    }
    return <></>;
  };

  const Media = () => {
    return (
      <div className="media">
        {user && <Avatar user={user} classModifiers="mr-3 avatar-xl" />}
        <div className="media-body">
          <h5 className="mr-3" data-uw-styling-context="true">
            {user && isDefined(user.first_name)
              ? `${user?.first_name} ${user?.last_name}`
              : NAME_UNKNOWN_USER}
          </h5>
          <span
            className="d-block text-muted font-size-sm"
            data-uw-styling-context="true"
          >
            {user ? user.email : ''}
          </span>
          <span>
            <Badge />
          </span>
        </div>
      </div>
    );
  };

  return (
    <CardBody>
      <div className="row">
        <div className="col-8">
          <Media />
        </div>
        <div className="d-flex justify-content-end align-items-center col-4">
          {user?.status === STATUS_INVITED && (
            <ButtonIcon
              icon="email"
              label={LABEL_BUTTON_RESEND_INVITATION}
              onclick={onClickResent}
              loading={loading}
            />
          )}
        </div>
      </div>
    </CardBody>
  );
};

const FormUser = ({ user = {}, onHandleChange, setRole }) => {
  const userInputs = stringConstants.users.inputs;

  const [searchRole, setSearchRole] = useState(null);

  useEffect(() => {
    if (user?.roleInfo) {
      setSearchRole({
        search: user.roleInfo.name,
      });
    }
  }, [user?.roleInfo]);

  const onInputSearch = (e) => {
    const { value } = e.target || {};

    setSearchRole({
      ...searchRole,
      search: value?.name,
    });

    setRole(value?.id);
  };

  return (
    <CardFooter>
      <FormItem title={userInputs.fullName.title} labelFor="firstNameLabel">
        <div className="input-group input-group-sm-down-break">
          <input
            type="text"
            className="form-control"
            name="first_name"
            id="firstNameLabel"
            placeholder={`${userInputs.fullName.placeholderName}`}
            aria-label={`${userInputs.fullName.placeholderName}`}
            value={user.first_name || ''}
            data-uw-styling-context="true"
            onChange={onHandleChange}
          />
          <input
            type="text"
            className="form-control"
            name="last_name"
            id="lastNameLabel"
            placeholder={`${userInputs.fullName.placeholderLastName}`}
            aria-label={`${userInputs.fullName.placeholderLastName}`}
            value={user.last_name || ''}
            data-uw-styling-context="true"
            onChange={onHandleChange}
          />
        </div>
      </FormItem>

      <FormItem title={userInputs.title.title} labelFor="titleLabel">
        <input
          type="text"
          className="form-control"
          name="title"
          id="titleLabel"
          placeholder={userInputs.title.placeholder}
          aria-label={userInputs.title.placeholder}
          value={user.title || ''}
          data-uw-styling-context="true"
          onChange={onHandleChange}
        />
      </FormItem>

      <FormItem title={userInputs.phoneNumber.title} labelFor="phoneLabel">
        <input
          type="number"
          className="form-control"
          name="phone"
          id="phoneLabel"
          placeholder={userInputs.phoneNumber.placeholder}
          aria-label={userInputs.phoneNumber.placeholder}
          value={user.phone || ''}
          data-uw-styling-context="true"
          onChange={onHandleChange}
        />
      </FormItem>

      <FormItem title={userInputs.email.title} labelFor="emailLabel">
        <input
          type="email"
          className="form-control"
          name="email"
          id="emailLabel"
          placeholder={userInputs.phoneNumber.placeholder}
          aria-label={userInputs.phoneNumber.placeholder}
          disabled={true}
          value={user.email || ''}
          data-uw-styling-context="true"
          onChange={onHandleChange}
        />
      </FormItem>

      <FormItem title="Roles" labelFor="rolsLabel">
        <IdfSelectRole
          id="selectRoleDropdown"
          onChange={onInputSearch}
          value={searchRole}
        />
      </FormItem>
    </CardFooter>
  );
};

const userEmpty = {
  first_name: '',
  last_name: '',
  email: '',
  status: null,
};

const ResentInvite = () => {
  const history = useHistory();
  const { id: userId } = useParams();

  const [currentUser, setCurrentUser] = useState(userEmpty);
  const [formUser, setFormtUser] = useState(userEmpty);
  const [roleIdSelect, setRoleIdSelect] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadResent, setLoadResent] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [resetPassModal, setResetPassModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const constants = stringConstants.settings.security;

  const titleDefault = pageTitleBeautify([
    currentUser?.first_name
      ? `${currentUser?.first_name} ${currentUser?.last_name}`
      : NAME_INVITED_USER,
    'Settings',
    'Manage Users',
  ]);

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    if (name !== 'roles') {
      setFormtUser({
        ...formUser,
        [name]: value,
      });
    } else {
      setRoleIdSelect(value);
    }
  };

  const validate = () => {
    if (currentUser.status !== STATUS_INVITED) {
      if (isEmpty(formUser.first_name)) {
        setWarningMessage(ERROR_FIRST_NAME_REQUIRED);
      } else if (isEmpty(formUser.last_name)) {
        setWarningMessage(ERROR_LAST_NAME_REQUIRED);
      } else {
        return true;
      }

      return false;
    } else {
      return true;
    }
  };

  const onHandleClickUpdate = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);
      const userUpdate = {
        firstName: formUser.first_name,
        lastName: formUser.last_name,
        status: formUser.status,
        avatar: formUser.avatar,
        role: roleIdSelect,
        phone: formUser.phone,
        title: formUser.title,
      };
      try {
        const userSuccess = await userService.updateUserInfoById(
          userId,
          userUpdate
        );
        setCurrentUser({
          ...currentUser,
          ...userSuccess,
        });
        setSuccessMessage(USER_UPDATE_SUCCESS);
      } catch (err) {
        setErrorMessage(SERVER_ERROR);
      } finally {
        setLoading(false);
      }
    }
  };

  const onHandleClickResent = async (e) => {
    e.preventDefault();
    setLoadResent(true);

    const data = {
      id: userId,
      email: formUser.email,
    };

    try {
      await userService.resentInvite(data);
      setSuccessMessage(SEND_EMAIL_SUCCESS);
    } catch (err) {
      setErrorMessage(SERVER_ERROR);
    } finally {
      setLoadResent(false);
    }
  };

  const onHandleChangeStatus = async (e) => {
    e.preventDefault();

    const status =
      currentUser?.status === STATUS_ACTIVE ? STATUS_SUSPENDED : STATUS_ACTIVE;
    const MESSAGE_ALERT =
      currentUser?.status === STATUS_ACTIVE ? USER_SUSPENDED : USER_ACTIVE;

    try {
      const userUpdate = await userService.changeStatus(userId, status);
      setCurrentUser(userUpdate);
      setOpenModal(false);
      setSuccessMessage(MESSAGE_ALERT);
    } catch (err) {
      setErrorMessage(SERVER_ERROR);
    }
  };

  const onImpersonateClick = async (e) => {
    e.preventDefault();
    try {
      await authService.impersonate(userId);
      history.push('/');
      window.location.reload(false);
    } catch (err) {
      console.log(err);
      setErrorMessage(SERVER_ERROR);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = await userService.getUserById(userId);

        setCurrentUser(user);
        setFormtUser(user);
        setRoleIdSelect(user.role);
      } catch (err) {
        setErrorMessage(SERVER_ERROR);
      }
    };
    getUserInfo();
  }, [currentUser.id]);

  const updatePassword = async (password, generate) => {
    try {
      await userService.updatePasswordByUserId(currentUser.id, {
        generate,
        password: password || '',
      });
      setResetPassModal(false);
      setSuccessMessage(constants.successMessage);
    } catch (error) {
      setErrorMessage(constants.errorMessage);
    }
  };

  return (
    <div>
      <AlertWrapper>
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert
          message={warningMessage}
          setMessage={setWarningMessage}
          color="warning"
        />
      </AlertWrapper>
      <Helmet>
        <title>{titleDefault}</title>
      </Helmet>
      <ModalConfirm
        open={openModal}
        onHandleConfirm={onHandleChangeStatus}
        onHandleClose={() => setOpenModal(false)}
        textBody={
          currentUser?.status === STATUS_ACTIVE
            ? TEXT_INFO_MODAL_SUSPEND
            : TEXT_INFO_MODAL_ACTIVE
        }
        labelButtonConfirm={
          currentUser?.status === STATUS_ACTIVE ? 'Yes, Suspend' : 'Yes, Active'
        }
        iconButtonConfirm="people"
        colorButtonConfirm={
          currentUser?.status === STATUS_ACTIVE
            ? 'outline-danger'
            : 'outline-success'
        }
      />
      <Card>
        <CardHeader className="d-block">
          <Row noGutters>
            <div className="d-flex align-items-center col-6">
              <span className="font-weight-bold">User</span>
            </div>
            <div className="d-flex justify-content-end align-items-center col-6">
              <Button onClick={onImpersonateClick} className="mr-2">
                Impersonate
              </Button>

              <div className="mr-2">
                <Link to={`${routes.usersProfile}/${userId}`}>
                  <ButtonIcon icon="person" label="View Profile" />
                </Link>
              </div>
              <ButtonIcon
                icon="save"
                label="Update User"
                onclick={onHandleClickUpdate}
                loading={loading}
              />
              <ButtonIcon
                color="white"
                classnames="ml-2"
                icon="lock"
                label={constants.btnResetPassword}
                onclick={() => setResetPassModal(true)}
                loading={loading}
                hidden={currentUser.status === STATUS_INVITED}
              />
            </div>
          </Row>
        </CardHeader>
        <InfoCard
          user={currentUser}
          onClickResent={onHandleClickResent}
          loading={loadResent}
        />
        <FormUser
          onHandleChange={onHandleChange}
          user={formUser}
          setRole={setRoleIdSelect}
        />
        {currentUser.status && currentUser.status !== STATUS_INVITED && (
          <CardFooter>
            <Row noGutters>
              <div className="col-8">
                <span className="font-weight-bold">
                  {LABEL_BUTTON_SUSPEND_USER}:
                </span>
                <div className="fs-6">{SUSPEND_USER_MESSAGE}</div>
              </div>
              <div className="d-flex justify-content-end align-items-center col-4">
                <ButtonIcon
                  color={
                    currentUser?.status === STATUS_ACTIVE
                      ? 'outline-danger'
                      : 'outline-success'
                  }
                  classnames="btn-sm"
                  icon="people"
                  label={
                    currentUser?.status === STATUS_ACTIVE
                      ? LABEL_BUTTON_SUSPEND_USER
                      : LABEL_BUTTON_ACTIVATE_USER
                  }
                  onclick={() => setOpenModal(!openModal)}
                  loading={loading}
                />
              </div>
            </Row>
          </CardFooter>
        )}
      </Card>

      <IdfModalResetPass
        isOpen={resetPassModal}
        buttonLabel={constants.btnResetPasswordModal}
        handleSubmit={(pass, auto) => updatePassword(pass, auto)}
        onHandleCloseModal={() => setResetPassModal(false)}
      />
    </div>
  );
};

export default ResentInvite;
