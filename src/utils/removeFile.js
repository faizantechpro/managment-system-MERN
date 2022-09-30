import filesService from '../services/files.service';
import { FILE_REMOVED } from './constants';

export const removeFile = async ({
  id,
  setOpen,
  setErrorMessage,
  setSuccessMessage,
  setRefreshRecentFiles,
  getFiles,
}) => {
  const response = await filesService.removeFile(id).catch((err) => {
    if (err?.response?.status === 403) {
      setErrorMessage('You dont have permission to remove this file');
      return setOpen(false);
    }

    if (err?.response?.status === 404) {
      setErrorMessage(err.response.data.error);
      setOpen(false);
    }
  });

  if (response?.response?.status === 403) {
    setErrorMessage(response.response.data.error);
    return setOpen(false);
  }

  if (response?.response?.status === 404) {
    setErrorMessage(response.response.data.error);
    return setOpen(false);
  }

  setSuccessMessage(FILE_REMOVED);
  setOpen(false);

  setTimeout(() => {
    setRefreshRecentFiles(true);
    getFiles && getFiles();
  }, 2000);
};
