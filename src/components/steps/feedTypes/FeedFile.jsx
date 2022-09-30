import { useState } from 'react';

import FileIcon from '../../fileIcon/FileIcon';
import { getFileSize, setDateFormat } from '../../../utils/Utils';
import assetsService from '../../../services/assets.service';
import MoreActions from '../../MoreActions';
import { items } from '../../../views/Deals/pipelines/Pipeline.constants';
import DeleteFile from '../../peopleProfile/contentFeed/DeleteFile';
import { removeFile } from '../../../utils/removeFile';
import filesService from '../../../services/files.service';
import { FILE_DOESNT_EXIST } from '../../../utils/constants';
import RenameModal from '../../modal/RenameModal';

const FeedFile = ({
  data,
  setRefreshRecentFiles,
  isOwner,
  updated_at,
  wholeLength,
  index,
}) => {
  const FullName = data?.filename_download?.split('.') || [];
  const extension = FullName ? FullName[FullName.length - 1] : '';
  const [removeFeedFile, setRemoveFeedFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
    assetsService.downloadFile(data.id, data.filename_download).catch((_) => {
      setErrorMessage(FILE_DOESNT_EXIST);
    });
  };

  const rename = async () => {
    setLoading(true);
    const id = await filesService.renameFile(data.id, name + '.' + extension);
    id
      ? setSuccessMessage('File is renamed Successfully')
      : setErrorMessage('File is not renames successfully');
    setLoading(false);
    setRefreshRecentFiles(true);
    setRenameModal(false);
  };

  return (
    <>
      <div
        className={`row align-items-center gx-2 py-2 mx-3 ${
          index !== wholeLength - 1 && 'border-bottom'
        }`}
      >
        <FileIcon info={data} size="sm" />
        <div className="col">
          <h5 className="mb-1">
            <div className="text-block cursor-pointer" onClick={onDownload}>
              {data.filename_download}
            </div>
          </h5>
          <ul className="list-inline list-separator text-muted font-size-xs">
            <li className="list-inline-item">
              {updated_at &&
                `Updated ${setDateFormat(updated_at, 'MMM DD YYYY h:mm A')}  `}
              {getFileSize(data.filesize)}
            </li>
          </ul>
        </div>
        {isOwner && (
          <>
            <DeleteFile
              id={data.id}
              confirmOpen={removeFeedFile}
              setConfirmOpen={setRemoveFeedFile}
              successMessage={successMessage}
              setSuccessMessage={setSuccessMessage}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              removeFile={removeFile}
              setRefreshRecentFiles={setRefreshRecentFiles}
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
    </>
  );
};

FeedFile.defaultProps = {
  data: {},
};

export default FeedFile;
