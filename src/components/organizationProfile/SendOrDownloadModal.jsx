import { useState, useEffect, useRef } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Col, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';

import dataReportConstants from '../../utils/constants/dataReport.json';
import TextInput from '../inputs/TextInput';
import TextAreaInput from '../inputs/TextAreaInput';
import { CardButton } from '../layouts/CardLayout';
import IdfAddUserToListWithButtonSelect from '../idfComponents/idfDropdown/IdfAddUserToListWithButtonSelect';
import publicReportService from '../../services/publicReport.service';
import ShareToolbar from './ShareToolbar';
import reportService from '../../services/report.service';

const constants = dataReportConstants.strings;
const shareItems = dataReportConstants.tabs.share;

const SendOrDownloadModal = ({
  showModal,
  setShowModal,
  getProfileInfo,
  setToast,
  setColorToast,
  organizationId,
}) => {
  const linkRef = useRef(null);
  const [shareTab, setShareTab] = useState('email');
  const [emails, setEmails] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [reportFile, setReportFile] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    getRecentReports();
  }, []);

  const getRecentReports = () => {
    reportService
      .getLeadReport(organizationId, 'TREASURY')
      .then((res) => {
        if (res.pagination.count > 0) {
          setReportFile(res.data[0].file_id);
        }
      })
      .catch((err) => console.log(err));
  };

  const sendReport = async (emails, subject, message) => {
    const invitationResults = emails?.map(
      async (email) =>
        new Promise((resolve) => {
          const dataReportToSend = {
            email: {
              to: email.email,
              subject,
              message,
            },
            redirect_url: `${window.location.origin}/public/organizations/profile`,
          };

          if (reportFile) {
            dataReportToSend.resources = {
              type: 'report',
              id: reportFile,
            };
          }

          publicReportService
            .shareReportToEmail(email.id, dataReportToSend)
            .then((res) => {
              if (res?.response?.data?.errors[0].message) {
                return handleAlreadySentReportNotif();
              }

              getProfileInfo();
              resolve();
            })
            .catch(() => handleAlreadySentReportNotif());
        })
    );

    await Promise.all(invitationResults);
  };

  const handleCloseModal = () => {
    setIsLoadingEmail(false);
    setShowModal(false);
  };

  const handleAlreadySentReportNotif = () => {
    handleCloseModal();

    setColorToast(constants.colors.danger);
    return setToast('Email already sent before');
  };

  const handleSendReport = async () => {
    setIsLoadingEmail(true);

    await sendReport(emails, subject, message).catch(() =>
      handleAlreadySentReportNotif()
    );

    handleCloseModal();

    setToast('E-mail sent successfully');
    setColorToast(constants.colors.success);
  };

  const onCopyLink = (e) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/public/organizations/profile/sign-in`
    );

    setLinkCopied(true);

    setTimeout(() => setLinkCopied(false), 2000);
  };

  const closeBtn = (
    <button className={`close`} onClick={handleCloseModal}>
      &times;
    </button>
  );

  return (
    <Modal isOpen={showModal} fade={false} size="lg" className="w-600">
      <ModalHeader tag="h3" close={closeBtn}>
        Share Client Portal
      </ModalHeader>
      <ModalBody className="p-0 m-3">
        <ShareToolbar
          id={`modal-report-tabs`}
          activeTab={shareTab}
          setActiveTab={setShareTab}
          tabs={shareItems}
        />

        {shareTab === 'email' && (
          <Container fluid className="px-2">
            <IdfAddUserToListWithButtonSelect
              title="Search for contact, organization or deal"
              placeholder="Write the name or email"
              label="Email To"
              setEmails={setEmails}
              organizationId={organizationId}
            />
            <TextInput
              id={`activity-location`}
              label={`Subject`}
              labelSize={`full`}
              placeholder={`Subject`}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <TextAreaInput
              name={`activity-description`}
              label={`Message`}
              labelSize={`full`}
              rows={2}
              placeholder={`Message (optional)`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Container>
        )}
        {shareTab === 'getLink' && (
          <Container fluid className={`px-2 text-left`} ref={linkRef}>
            <p>Share Link</p>
            <div className="d-flex justify-content-between">
              <span className="p-2 rounded border w-75">{`${window.location.origin}/public/organizations/profile/sign-in`}</span>
              <OverlayTrigger
                target={linkRef}
                show={linkCopied}
                placement="top"
                overlay={
                  <Tooltip className="font-weight-bold">Link Copied!</Tooltip>
                }
              >
                <CardButton
                  type="button"
                  className={'font-weight-500 btn-primary'}
                  title="Copy Link"
                  variant="success"
                  icon="copy_all"
                  onClick={onCopyLink}
                />
              </OverlayTrigger>
            </div>
            <p className="minimum-letter">
              Note: The Client portal link will be work if you had shared it
              with contacts previously
            </p>
          </Container>
        )}
      </ModalBody>
      <ModalFooter className="border-0 pt-0 padding-r-12">
        {shareTab === 'email' && (
          <Col className={`col-auto p-0`}>
            <CardButton
              className={'font-weight-500 btn-white mr-2'}
              title={`Cancel`}
              onClick={handleCloseModal}
            />
            <CardButton
              className={'font-weight-500 btn-primary'}
              title={`Send`}
              variant={`success`}
              icon={`email`}
              isLoading={isLoadingEmail}
              onClick={handleSendReport}
            />
          </Col>
        )}
        {shareTab === 'getLink' && (
          <Col className={`col-auto p-0`}>
            <CardButton
              className={'font-weight-500 btn-primary mr-2'}
              title="Done"
              onClick={handleCloseModal}
            />
          </Col>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default SendOrDownloadModal;
