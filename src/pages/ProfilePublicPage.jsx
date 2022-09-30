import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import qs from 'qs';

import publicReportService from '../services/publicReport.service';
import PublicProfileSidebar from '../components/publicProfilePage/PublicProfileSidebar';
import PublicProfileContent from '../components/publicProfilePage/PublicProfileContent';
import Alert from '../components/Alert/Alert';
import AlertWrapper from '../components/Alert/AlertWrapper';
import { useTenantContext } from '../contexts/TenantContext';

const ProfilePublicPage = () => {
  const history = useHistory();
  const location = useLocation();

  const [reportData, setReportData] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [organizationId, setOrganizationId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [contactId, setContactId] = useState('');
  const { tenant } = useTenantContext();

  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  const hasQueryKeys = Object.keys(query).length > 0;

  useEffect(async () => {
    if (hasQueryKeys) {
      const accessToken = query.token;
      const sharedResourceId = query.resource_id;
      const token = {
        access_token: accessToken,
        public_report_id: sharedResourceId, // TODO remove this usage
        organization_id: sharedResourceId,
      };
      sessionStorage.setItem('idftoken-public', JSON.stringify(token));
      history.push(`/public/organizations/profile`);
    } else {
      history.push(`/public/organizations/profile/sign-in`);
    }
  }, []);

  useEffect(() => {
    if (hasQueryKeys) {
      const session = sessionStorage.getItem('idftoken-public');
      const organizationId = JSON.parse(session).organization_id;

      if (session && organizationId) {
        getUserInfo();
        getReport(organizationId);
        setOrganizationId(organizationId);
      }
    }
  }, [hasQueryKeys]);

  useEffect(() => {
    getTheme();
  }, [tenant]);

  const getTheme = async () => {
    if (tenant?.colors) {
      document.documentElement.style.setProperty(
        '--primaryColor',
        tenant?.colors.primaryColor
      );
      document.documentElement.style.setProperty(
        '--secondaryColor',
        tenant?.colors.secondaryColor
      );
    }
  };

  const getUserInfo = async () => {
    const response = await publicReportService
      .getSharedUser()
      .catch(() => history.push(`/public/organizations/profile/sign-in`));

    const { data } = response || {};

    setUserInfo(data?.shared_by);
    setContactId(data?.contact_id);
  };

  const getReport = async (organizationId) => {
    const reportResponse = await publicReportService
      .getReport(organizationId)
      .catch((err) => console.log(err));

    const { data } = reportResponse || {};

    if (data) setReportData(data[0]);
  };

  return (
    <>
      <Row className="p-0 m-0">
        <PublicProfileSidebar
          userInfo={userInfo}
          organizationId={organizationId}
          contactId={contactId}
        />

        <PublicProfileContent
          reportData={reportData}
          organizationId={organizationId}
        />
      </Row>

      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default ProfilePublicPage;
