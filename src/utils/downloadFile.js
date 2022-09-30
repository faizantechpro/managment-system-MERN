import assetsService from '../services/assets.service';

export const downloadFile = async ({
  file,
  setDownloadInfo,
  setDownloadingFile,
}) => {
  const options = {
    onDownloadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;

      setDownloadInfo({
        progress: Math.floor((loaded * 100) / total),
      });
    },
  };

  setDownloadingFile(file?.file?.id);

  await assetsService.downloadFile(
    file?.file?.id,
    file?.file?.filename_download,
    options
  );

  setDownloadingFile('');
};
