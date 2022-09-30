import React, { useState, useEffect } from 'react';

import './siteSettings.css';
import Loading from '../Loading';
import Alert from '../Alert/Alert';
import FormColor from './FormColor';
import AlertWrapper from '../Alert/AlertWrapper';
import tenantService from '../../services/tenant.service';
import { createBlobObject } from '../../utils/Utils';
import { BRANDING_LABEL, CHOOSE_IMAGE_FILE } from '../../utils/constants';
import ButtonIcon from '../commons/ButtonIcon';
import IdfIcon from '../idfComponents/idfIcon';
import IdfTooltip from '../idfComponents/idfTooltip';
import { FormCheck } from 'react-bootstrap';
import userService from '../../services/user.service';
import DragDropUploadFile from '../commons/DragDropUploadFile';
const SiteSettingsForm = () => {
  const [saving, setSaving] = useState(false);
  const [tenantInfo, setTenantInfo] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [logo, setLogo] = useState();
  const [icon, setIcon] = useState();

  const getLogo = async (id) => {
    const response = await userService.getFile(id);
    return response?.data;
  };

  const getTenant = async () => {
    try {
      const { tenant } = await tenantService.getTenant();
      setTenantInfo(tenant);

      if (tenant.logo) {
        const partnerLogo = await getLogo(tenant.logo);

        if (partnerLogo) {
          setLogo({
            ...partnerLogo,
            name: partnerLogo.filename_download,
            size: partnerLogo.filesize,
          });
        }
      }

      if (tenant.icon) {
        const partnerIcon = await getLogo(tenant.icon);

        if (partnerIcon) {
          setIcon({
            ...partnerIcon,
            name: partnerIcon.filename_download,
            size: partnerIcon.filesize,
          });
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const onChangeColor = (value) => {
    setTenantInfo({
      ...tenantInfo,
      colors: { ...tenantInfo?.colors, ...value, name: 'custom' },
    });
  };

  const validateInfo = () => {
    const domainValidation = /^[a-zA-Z]+[a-zA-Z-_\d]*$/;
    const { domain } = tenantInfo;
    if (domain.includes('localhost')) {
      return true;
    }
    const subdomain = domain.split('.')[0];

    if (subdomain && !domainValidation.test(subdomain)) {
      setErrorMessage('Default Domain is not valid');
      return false;
    }

    return true;
  };

  const onUploadLogo = async (file) => {
    const form = new FormData();
    form.append('file', await createBlobObject(file), file.name);
    const {
      data: {
        data: { id },
      },
    } = await userService.uploadAvatar(form);
    return id;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateInfo()) {
        setSaving(true);

        let logoId = logo?.id || '';
        // lastModified indicates that file is dropped for upload, so upload it first
        // if there is already logo in category then avoid calling upload
        if (logo && logo?.lastModified) {
          // if there is a logo, then first upload it
          logoId = await onUploadLogo(logo);
        }

        let iconId = icon?.id || '';
        // lastModified indicates that file is dropped for upload, so upload it first
        // if there is already logo in category then avoid calling upload
        if (icon && icon?.lastModified) {
          // if there is a logo, then first upload it
          iconId = await onUploadLogo(icon);
        }

        await tenantService.updateTenant({
          ...tenantInfo,
          logo: logoId,
          icon: iconId,
        });
        setSaving(false);
        setSuccessMessage('Tenant updated successfully');
        window.location.reload();
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    getTenant();
  }, []);

  const handleUseLogo = () => {
    setTenantInfo({
      ...tenantInfo,
      use_logo: !tenantInfo.use_logo,
    });
  };

  const onLoadLogo = async (event) => {
    const target = event.target.files[0];
    setTenantInfo({ ...tenantInfo, logo: '' });
    setLogo(target);
  };

  const onLoadIcon = async (event) => {
    const target = event.target.files[0];
    setTenantInfo({ ...tenantInfo, icon: '' });
    setIcon(target);
  };

  return (
    <>
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

      {tenantInfo === undefined ? (
        <Loading />
      ) : (
        <div className="card mb-3 mb-lg-5">
          <div className="card-header">
            <h4 className="card-title">{BRANDING_LABEL}</h4>
          </div>
          <div className="card-body">
            <div className="border-bottom border-gray-300 pb-4">
              <div className="d-flex align-items-center justify-content-between">
                <h5>Icon</h5>
                <DragDropUploadFile
                  file={icon}
                  setFile={setIcon}
                  onLoadFile={onLoadIcon}
                  preview
                  logoId={tenantInfo?.icon}
                  chooseFileText={CHOOSE_IMAGE_FILE}
                  containerHeight={60}
                  emptyContainerHeight={80}
                />
              </div>
              <div className="d-flex align-items-center mt-4 justify-content-between">
                <h5>
                  Logo{' '}
                  <IdfTooltip text="A partner logo can be 280px wide and 80px tall. Please remove all extra white spaces around the logo before uploading.">
                    <IdfIcon icon="help_outline" />
                  </IdfTooltip>
                </h5>
                <DragDropUploadFile
                  file={logo}
                  setFile={setLogo}
                  onLoadFile={onLoadLogo}
                  preview
                  logoId={tenantInfo?.logo}
                  chooseFileText={CHOOSE_IMAGE_FILE}
                  containerHeight={85}
                  emptyContainerHeight={80}
                />
              </div>
            </div>
            <div className="d-flex align-items-center mt-4 justify-content-between">
              <h5>Use Logo Instead of Icon</h5>
              <FormCheck
                id="useLogoInsteadOfIcon"
                type="switch"
                custom={true}
                name="useLogoInsteadOfIcon"
                checked={tenantInfo.use_logo}
                onChange={handleUseLogo}
              />
            </div>
            <div className="d-flex align-items-center mt-4 justify-content-between">
              <h5>
                Accent Color{' '}
                <IdfTooltip text="An accent color will be applied to all links, buttons.">
                  <IdfIcon icon="help_outline" />
                </IdfTooltip>
              </h5>
              <FormColor
                name="secondaryColor"
                value={tenantInfo?.colors?.secondaryColor}
                onChange={onChangeColor}
              />
            </div>
          </div>
          <div className="card-footer">
            <div className="d-flex justify-content-end">
              <ButtonIcon
                label="Save Changes"
                type="submit"
                loading={saving}
                color="primary"
                onclick={onSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SiteSettingsForm;
