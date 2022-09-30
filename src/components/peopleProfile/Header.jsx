import React, { useState, useEffect } from 'react';
import { Badge } from 'reactstrap';
import { Dropdown } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import Avatar from '../Avatar';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import Heading from '../heading';
import userService from '../../services/user.service';
import contactService from '../../services/contact.service';
import stringConstants from '../../utils/stringConstants.json';
import routes from '../../utils/routes.json';
import IdfOwnersHeader from '../idfComponents/idfAdditionalOwners/IdfOwnersHeader';
import ModalAvatar from '../modal/ModalAvatar';
import filesService from '../../services/files.service';
import { base64ToBlob, pageTitleBeautify } from '../../utils/Utils';
import { Helmet } from 'react-helmet-async';
import DeleteModal from '../modal/DeleteModal';

const globalStrings = stringConstants.global.avatar;
const constants = stringConstants.deals.contacts.profile;
const organizationConstants = stringConstants.deals.organizations;

const Header = ({ data, refreshOwners, setRefresOwners, isPrincipalOwner }) => {
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [openModalAvatar, setOpenModalAvatar] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [deleteResults, setDeleteResults] = useState([]);
  const [showDeleteReport, setShowDeleteReport] = useState(false);
  const [modified, setModified] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [fullname, setFullName] = useState('User Profile');

  const history = useHistory();

  useEffect(() => {
    setFullName(
      userInfo.first_name
        ? userInfo.first_name +
            ' ' +
            (userInfo.last_name ? userInfo.last_name : ' ')
        : 'User Profile'
    );
  }, [userInfo]);

  useEffect(() => {
    setUserInfo(data);
    setAllOrganizations([data]);
    setSelectedData([data.id]);
  }, [data]);

  useEffect(() => {
    if (!openModal && isDeleted) {
      setTimeout(() => {
        history.push(routes.contacts);
      }, 1000);
    }
  }, [openModal]);

  const handleDelete = async () => {
    try {
      const response = await contactService.deleteContacts([userInfo.id]);
      setDeleteResults(response);
      setIsDeleted(response[0].result === 'success');
      setShowDeleteReport(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const updateContactAvatar = (avatarId) => {
    contactService
      .updateContact(userInfo.id, { avatar: avatarId })
      .then(() => {
        setSuccessMessage(globalStrings.uploadSuccess);
        setOpenModalAvatar(false);
      })
      .catch(() => {
        setErrorMessage(globalStrings.uploadError);
      });
  };

  const onHandleSaveAvatar = async ({ src, name }) => {
    setLoading(true);
    // onUploadAvatar
    const form = new FormData();
    form.append('file', await base64ToBlob(src), name);
    const avatarResult = await userService.uploadAvatar(form).catch((_) => {
      setErrorMessage(globalStrings.uploadError);
    });

    const result = avatarResult?.data;

    setUserInfo((prev) => ({
      ...prev,
      avatar: result.data.id,
      avatarSrc: src,
    }));

    if (result?.data?.id) {
      await updateContactAvatar(result.data.id);
      setLoading(false);
    }
  };

  const removeFile = async () => {
    setLoading(true);
    filesService
      .removeFileById(userInfo.avatar)
      .then(() => {
        updateContactAvatar(null);
        setUserInfo((prev) => ({
          ...prev,
          avatar: null,
          avatarSrc: null,
        }));
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage(globalStrings.uploadError);
      });
  };

  return (
    <div className="page-header mb-0 pb-0">
      <Helmet>
        <title>{pageTitleBeautify([fullname, 'Contacts'])}</title>
      </Helmet>
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
      {openModal && (
        <DeleteModal
          type="contacts"
          showModal={openModal}
          setShowModal={setOpenModal}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          event={handleDelete}
          data={allOrganizations}
          results={deleteResults}
          setResults={setDeleteResults}
          showReport={showDeleteReport}
          setShowReport={setShowDeleteReport}
          modified={modified}
          setModified={setModified}
          constants={organizationConstants.delete}
          resetSeletedData={false}
        />
      )}

      <ModalAvatar
        open={openModalAvatar}
        onHandleClose={() => setOpenModalAvatar(false)}
        userInfo={userInfo}
        onRemove={removeFile}
        loading={loading}
        onSaveAvatar={onHandleSaveAvatar}
        type="contact"
      />

      <div className="row align-items-end">
        <div className="col-sm mb-2 mb-sm-0">
          <Heading useBc title={fullname} showGreeting={false} />
          <div className="media mb-3">
            <label
              className="avatar avatar-xl avatar-circle avatar-border-lg avatar-uploader mr-3"
              htmlFor="avatarUploader"
              onClick={() => setOpenModalAvatar(true)}
            >
              <Avatar
                classModifiers="max-wh"
                defaultSize="lg"
                user={userInfo}
              />
              <span className="avatar-uploader-trigger">
                <i className="material-icons-outlined avatar-uploader-icon shadow-soft">
                  edit
                </i>
              </span>
            </label>
            <div className="media-body">
              <div className="row align-items-center no-gutters">
                <div className="col-lg mb-3 mb-lg-0">
                  <h1 className="page-header-title">{fullname}</h1>
                  <div className="row align-items-center no-gutters mt-2">
                    <div className="col-auto d-flex align-items-center w-50">
                      {userInfo.is_customer ? (
                        <Badge
                          color={`success`}
                          style={{ fontSize: '12px' }}
                          className="text-uppercase"
                        >
                          {
                            stringConstants.deals.organizations.profile
                              .customerTitle
                          }
                        </Badge>
                      ) : (
                        <Badge
                          id={userInfo?.label?.id}
                          style={{
                            fontSize: '12px',
                            backgroundColor: `${userInfo?.label?.color}`,
                          }}
                          className="text-uppercase"
                        >
                          {userInfo?.label?.name}
                        </Badge>
                      )}
                      <IdfOwnersHeader
                        className="mx-3"
                        mainOwner={data?.assigned_user}
                        service={contactService}
                        serviceId={data?.id}
                        refreshOwners={refreshOwners}
                        setRefresOwners={setRefresOwners}
                        isprincipalowner={isPrincipalOwner}
                      />
                    </div>
                  </div>
                </div>

                {isPrincipalOwner && (
                  <div className="col-lg-auto ml-1">
                    <Dropdown drop="down" className="rounded">
                      <Dropdown.Toggle
                        className="dropdown-search btn-icon rounded-circle no-caret"
                        variant="link"
                      >
                        <i className="material-icons-outlined">more_vert</i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          className="text-danger"
                          onClick={() => setOpenModal(true)}
                        >
                          <i className="material-icons-outlined dropdown-item-icon text-danger">
                            delete
                          </i>
                          {constants.dropdown.delete}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
