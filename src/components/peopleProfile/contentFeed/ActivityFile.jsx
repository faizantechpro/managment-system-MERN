import { useState } from 'react';

import FileIcon from '../../fileIcon/FileIcon';
import { setDateFormat, getFileSize } from '../../../utils/Utils';
import { removeFile } from '../../../utils/removeFile';
import DeleteFile from './DeleteFile';
import MoreActions from '../../MoreActions';
import { items } from '../../../views/Deals/pipelines/Pipeline.constants';
import assetsService from '../../../services/assets.service';
import filesService from '../../../services/files.service';
import { FILE_DOESNT_EXIST } from '../../../utils/constants';
import RenameModal from '../../modal/RenameModal';

const ActivityFile = ({
  file,
  isModal,
  setRefreshRecentFiles,
  getFiles,
  publicPage,
  isOwner,
}) => {
  const FullName = file?.file.filename_download?.split('.') || [];
  const extension = FullName ? FullName[FullName.length - 1] : '';
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [removeFeedFile, setRemoveFeedFile] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [name, setName] = useState(
    FullName?.slice(0, FullName?.length - 1).join('.')
  );
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    setRemoveFeedFile((prev) => !prev);
  };

  const toggleRename = () => {
    setRenameModal((prev) => !prev);
  };

  const onDownload = () => {
    assetsService
      .downloadFile(file.file.id, file.file.filename_download)
      .catch((_) => {
        setErrorMessage(FILE_DOESNT_EXIST);
      });
  };

  const rename = async () => {
    setLoading(true);
    const id = await filesService.renameFile(
      file.file.id,
      name + '.' + extension
    );
    id
      ? setSuccessMessage('File is renamed Successfully')
      : setErrorMessage('File is not renames successfully');
    setLoading(false);
    setRefreshRecentFiles(true);
    setRenameModal(false);
  };

  return (
    <>
      <li className={`list-group-item ${isModal && 'cursor-pointer'}`}>
        <div className="row align-items-center gx-2">
          <FileIcon info={file.file} size="sm" />

          <div className="col">
            <h5 className="mb-1">
              <div className="text-block cursor-pointer">
                {file.file.filename_download}
              </div>
            </h5>
            <ul className="list-inline list-separator text-muted font-size-xs">
              <li className="list-inline-item">
                Updated {setDateFormat(file.file.uploaded_on)}
              </li>
              <li className="list-inline-item">
                {getFileSize(file.file.filesize)}
              </li>
            </ul>
          </div>
          {!publicPage && isOwner && (
            <>
              <DeleteFile
                confirmOpen={removeFeedFile}
                setConfirmOpen={setRemoveFeedFile}
                successMessage={successMessage}
                setSuccessMessage={setSuccessMessage}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                id={file.file_id}
                setRefreshRecentFiles={setRefreshRecentFiles}
                getFiles={getFiles}
                removeFile={removeFile}
              >
                <MoreActions
                  items={items}
                  toggleClassName="dropdown-search btn-icon more-actions-sm"
                  variant="outline-link"
                  onHandleRemove={toggleModal}
                  onHandleDownload={onDownload}
                  onHandleEdit={toggleRename}
                />
              </DeleteFile>
              <RenameModal
                open={renameModal}
                onHandleConfirm={rename}
                onHandleClose={() => {
                  setRenameModal(false);
                }}
                name={name}
                setName={setName}
                loading={loading}
                extension={extension}
              />
            </>
          )}
        </div>
      </li>
    </>
  );
};

export default ActivityFile;
