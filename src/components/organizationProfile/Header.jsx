import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Badge } from 'reactstrap';
import { Dropdown } from 'react-bootstrap';

import Avatar from '../Avatar';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import Heading from '../heading';
import userService from '../../services/user.service';
import organizationService from '../../services/organization.service';
import stringConstants from '../../utils/stringConstants.json';
import routes from '../../utils/routes.json';
import IdfOwnersHeader from '../idfComponents/idfAdditionalOwners/IdfOwnersHeader';
import filesService from '../../services/files.service';
import ModalAvatar from '../modal/ModalAvatar';
import { base64ToBlob, pageTitleBeautify } from '../../utils/Utils';
import { CardButton } from '../layouts/CardLayout';
import SendOrDownloadModal from './SendOrDownloadModal';
import { Helmet } from 'react-helmet-async';
import DeleteModal from '../modal/DeleteModal';

const globalStrings = stringConstants.global.avatar;
const organizationConstants = stringConstants.deals.organizations;

const Header = ({
  data,
  refreshOwners,
  setRefresOwners,
  isPrincipalOwner,
  getProfileInfo,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [organizationInfo, setOrganizationInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [openModalAvatar, setOpenModalAvatar] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [deleteResults, setDeleteResults] = useState([]);
  const [showDeleteReport, setShowDeleteReport] = useState(false);
  const [modified, setModified] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [colorToast, setColorToast] = useState('success');

  const history = useHistory();

  useEffect(() => {
    setOrganizationInfo(data);
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
      const response = await organizationService.deleteOrganizations([
        organizationInfo.id,
      ]);
      setDeleteResults(response);
      setIsDeleted(response[0].result === 'success');
      setShowDeleteReport(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const updateOrganizationAvatar = (avatarId) => {
    organizationService
      .updateOrganization(organizationInfo.id, { avatar: avatarId })
      .then(() => {
        setSuccessMessage(
          avatarId ? globalStrings.uploadSuccess : globalStrings.removedSuccess
        );
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

    setOrganizationInfo((prev) => ({
      ...prev,
      avatar: result.data.id,
      avatarSrc: src,
    }));

    if (result?.data?.id) {
      await updateOrganizationAvatar(result.data.id);
      setLoading(false);
    }
  };

  const removeFile = async () => {
    setLoading(true);
    filesService
      .removeFileById(organizationInfo.avatar)
      .then(() => {
        updateOrganizationAvatar(null);
        setOrganizationInfo((prev) => ({
          ...prev,
          avatar: null,
          avatarSrc: null,
        }));
      })
      .catch(() => {
        setErrorMessage(globalStrings.uploadError);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>
          {' '}
          {pageTitleBeautify([
            organizationInfo.name || 'Organization Profile',
            'Contacts',
          ])}
        </title>
      </Helmet>
      <div className="page-header mb-0 pb-0 ">
        {openModal && (
          <DeleteModal
            type="organizations"
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
          userInfo={organizationInfo}
          onRemove={removeFile}
          loading={loading}
          onSaveAvatar={onHandleSaveAvatar}
          type="organization"
        />

        <div className="row align-items-end">
          <div className="col-sm mb-sm-0">
            <Heading
              useBc
              title={organizationInfo.name || 'Organization Profile'}
              showGreeting={false}
            />
            <div className="media mb-3">
              <label
                className="avatar avatar-xl avatar-circle avatar-border-lg avatar-uploader mr-3"
                htmlFor="avatarUploader"
                onClick={() => setOpenModalAvatar(true)}
              >
                <Avatar
                  classModifiers="max-wh"
                  user={organizationInfo}
                  type="organization"
                />
                <span className="avatar-uploader-trigger">
                  <i className="material-icons-outlined avatar-uploader-icon shadow-soft">
                    edit
                  </i>
                </span>
              </label>
              <div className="media-body">
                <div className="row align-items-center no-gutters">
                  <div className="header-profile col-lg mb-3 mb-lg-0">
                    <h1 className="page-header-title">
                      {organizationInfo.name || 'Organization Profile'}
                    </h1>
                    <div className="row align-items-center no-gutters mt-2">
                      <div className="col-auto d-flex align-items-center w-50">
                        {organizationInfo.is_customer ? (
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
                            id={organizationInfo?.label?.id}
                            style={{
                              fontSize: '12px',
                              backgroundColor: `${organizationInfo?.label?.color}`,
                            }}
                            className="text-uppercase"
                          >
                            {organizationInfo?.label?.name}
                          </Badge>
                        )}
                        <IdfOwnersHeader
                          className="mx-3"
                          mainOwner={data?.assigned_user}
                          service={organizationService}
                          serviceId={data?.id}
                          refreshOwners={refreshOwners}
                          setRefresOwners={setRefresOwners}
                          isprincipalowner={isPrincipalOwner}
                        />
                      </div>
                    </div>
                  </div>

                  <CardButton
                    className="font-weight-500 mr-2"
                    title="Share"
                    variant="success"
                    icon="share"
                    onClick={() => setShowShareModal(true)}
                  />

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
                            {`Delete`}
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

      {showShareModal && (
        <SendOrDownloadModal
          showModal={showShareModal}
          setShowModal={setShowShareModal}
          getProfileInfo={getProfileInfo}
          setToast={setToast}
          setColorToast={setColorToast}
          organizationId={organizationInfo.id}
          profileInfo={data}
        />
      )}

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

      <AlertWrapper>
        <Alert message={toast} setMessage={setToast} color={colorToast} />
      </AlertWrapper>
    </>
  );
};

export default Header;
