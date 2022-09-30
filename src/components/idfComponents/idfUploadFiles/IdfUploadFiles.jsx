import { useState, useEffect } from 'react';

import { getFileSize } from '../../../utils/Utils';
import stringConstants from '../../../utils/stringConstants.json';
import { VALID_FILES_EXTENSIONS } from '../../../utils/constants';
import { Spinner } from 'reactstrap';
import feedService from '../../../services/feed.service';
import ActivityFile from '../../peopleProfile/contentFeed/ActivityFile';
import UploadFileModal from '../../modal/UploadFileModal';

const constants = stringConstants.modals.uploadFileModal;

const FilePreview = ({ file, deleteFile }) => {
  const [fileInfo, setFileInfo] = useState({
    name: '',
    size: '',
  });

  useEffect(() => {
    setFileInfo((prev) => ({
      ...prev,
      name: file.name,
      size: getFileSize(file.size),
    }));
  }, [file]);

  return (
    <div className="js-dropzone dropzone-custom custom-file-boxed dz-clickable dz-started">
      <div className="col h-100 px-1 mb-2 dz-processing dz-success dz-complete">
        <div className="dz-preview dz-file-preview">
          <div
            className="d-flex justify-content-end dz-close-icon"
            onClick={deleteFile}
          >
            &times;
          </div>
          <div className="dz-details media">
            <span className="dz-file-initials text-capitalize">
              {fileInfo.name[0]}
            </span>
            <div className="media-body dz-file-wrapper">
              <h6 className="dz-filename">
                <span className="dz-title">{fileInfo.name}</span>
              </h6>
              <div className="dz-size">
                <strong>{fileInfo.size}</strong>
              </div>
            </div>
          </div>
          <div className="dz-progress progress">
            <div className="dz-upload progress-bar bg-success w-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IdfUploadFiles = ({
  fileInput,
  deleteFile,
  setErrorMessage,
  setFileInput,
  setIsLoading,
  handleSubmit,
  loading,
  publicPage,
  organizationId,
  openFilesModal,
  setOpenFilesModal,
}) => {
  const [recentFiles, setRecentFiles] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  useEffect(() => {
    if (publicPage) getRecentFiles();
  }, []);

  const getRecentFiles = () => {
    feedService
      .getFiles({ organizationId }, { limit: 5 })
      .then((res) => {
        setRecentFiles(res.files);
      })
      .catch(() => {
        setErrorMessage(constants.profile.getFileError);
      });
  };

  const onFileChange = (event) => {
    if (!event?.target?.files[0]?.type) {
      const extensionIndex = event?.target?.files[0].name.indexOf('.');
      const extension = event?.target?.files[0].name.slice(extensionIndex + 1);

      const macExtensions = ['pages', 'numbers', 'key'];

      if (!macExtensions.includes(extension))
        return setErrorMessage('Invalid extension');

      const newFile = new Blob([event?.target?.files[0]], {
        type: extension,
      });

      newFile.name = event?.target?.files[0].name.slice(0, extensionIndex);
      newFile.lastModifiedDate = event?.target?.files[0].lastModifiedDate;

      return setFileInput(newFile);
    }

    if (VALID_FILES_EXTENSIONS.includes(event?.target?.files[0]?.type)) {
      return setFileInput(event.target.files[0]);
    } else {
      setErrorMessage('Invalid extension');
    }
  };

  const onSubmit = () => {
    setIsLoading(true);
    handleSubmit(fileInput, setIsLoading, getRecentFiles);
  };

  return (
    <div className="position-relative">
      {fileInput ? (
        <>
          <FilePreview file={fileInput} deleteFile={deleteFile} />
        </>
      ) : (
        <>
          <div
            id="file"
            className="js-dropzone dropzone-custom custom-file-boxed p-3"
          >
            <div className="media m-auto d-flex justify-content-center">
              <h5>
                {constants.dragAndDrop}
                {' or '}
                <a>{constants.browseFiles}</a>
                {' for a file to upload'}
              </h5>
            </div>
          </div>

          <input
            className="file-input-drag"
            type="file"
            name="file"
            onChange={onFileChange}
            accept={VALID_FILES_EXTENSIONS}
            value={fileInput}
            id="file"
          />
        </>
      )}

      {fileInput && (
        <div className="d-flex justify-content-end my-3">
          <button
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={!fileInput}
          >
            {loading ? <Spinner /> : <span> Upload Files </span>}
          </button>
        </div>
      )}

      {publicPage && (
        <UploadFileModal
          setShowModal={setOpenUploadModal}
          showModal={openUploadModal}
          handleSubmit={handleSubmit}
          setErrorMessage={setErrorMessage}
          publicPage={publicPage}
        />
      )}

      {publicPage && (
        <ul className="list-group list-group-flush list-group-no-gutters mt-4">
          {recentFiles?.map((file) => (
            <ActivityFile
              key={file.file_id}
              file={file}
              openFilesModal={openFilesModal}
              publicPage={publicPage}
            />
          ))}
          {recentFiles?.length > 4 && (
            <button
              className="btn btn-white btn-sm"
              onClick={() => {
                setOpenFilesModal(true);
              }}
            >
              {constants.profile.viewAllLabel}
            </button>
          )}
        </ul>
      )}
    </div>
  );
};

export default IdfUploadFiles;
