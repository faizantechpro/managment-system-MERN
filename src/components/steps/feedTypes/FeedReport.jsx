import { useState } from 'react';
import { Button } from 'react-bootstrap';

import reportSvg from '../../../assets/svg/report.svg';
import reportService from '../../../services/report.service';
import filesService from '../../../services/files.service';
import Alert from '../../Alert/Alert';
import AlertWrapper from '../../Alert/AlertWrapper';
import { DOWNLOAD_STARTED, DOWNLOAD_ERROR } from '../../../utils/constants';
import stringConstants from '../../../utils/stringConstants.json';

const constants = stringConstants.feed.report;

const FeedReport = ({ data, organizationId }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDownload = async () => {
    if (data?.updates) {
      const updateFileId = data?.updates.find((item) => item.key === 'file_id');
      if (!updateFileId?.currentValue) return setErrorMessage(DOWNLOAD_ERROR);

      return downloadReport(updateFileId.currentValue);
    } else {
      if (!data?.file_id) return setErrorMessage(DOWNLOAD_ERROR);

      return downloadReport(data?.file_id);
    }
  };

  const downloadReport = async (file_id) => {
    try {
      const file = await filesService.getFile(file_id);

      if (file?.data?.filename_download) {
        setSuccessMessage(DOWNLOAD_STARTED);
        const createFeed = false;
        await reportService
          .downloadReport(
            file_id,
            file?.data?.filename_download,
            organizationId,
            createFeed
          )
          .catch(() => setErrorMessage(DOWNLOAD_ERROR));
      }
    } catch (_) {
      setErrorMessage(DOWNLOAD_ERROR);
    }
  };

  const getTitle = () => {
    if (data?.filename_download) {
      return data?.filename_download;
    } else if (data?.updates) {
      return constants.updatedLabel;
    } else {
      return constants.newLabel;
    }
  };

  return (
    <>
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <div className="card">
        <div className="card-body py-2">
          <ul className="list-group list-group-flush list-group-no-gutters">
            <li className="list-group-item">
              <div className="row align-items-center gx-2">
                <div className="col-auto">
                  <img
                    className="feed-report-icon"
                    src={reportSvg}
                    alt={data.report_name || 'File Icon'}
                  />
                </div>
                <div className="col">
                  <h5 className="mb-1">
                    <div>{getTitle()}</div>
                  </h5>
                  <ul className="list-inline list-separator text-muted font-size-xs">
                    <Button
                      onClick={
                        !data.filename_download
                          ? handleDownload
                          : downloadReport.bind(null, data?.id)
                      }
                      variant="outline-dark"
                    >
                      {constants.downloadButton}
                    </Button>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

FeedReport.defaultProps = {
  data: {},
};

export default FeedReport;
