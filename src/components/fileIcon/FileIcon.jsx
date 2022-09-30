import React from 'react';

import pdfSvg from '../../assets/svg/brands/PDF_2.svg';
import imageSvg from '../../assets/svg/brands/image_icon.svg';
import sheetsSvg from '../../assets/svg/brands/sheets.svg';
import slidesSvg from '../../assets/svg/brands/slides.svg';
import docsSvg from '../../assets/svg/brands/google-docs.svg';
import videoSvg from '../../assets/svg/brands/video.svg';
import textSvg from '../../assets/svg/brands/text-file.svg';

const FileIcon = ({ info, size }) => {
  const getSrc = () => {
    if (info?.type === 'pdf') {
      return pdfSvg;
    } else if (info?.type?.includes('image')) {
      return imageSvg;
    } else if (
      info?.type?.includes('sheet') ||
      info?.type?.includes('excel') ||
      info?.type?.includes('numbers')
    ) {
      return sheetsSvg;
    } else if (
      info?.type?.includes('slide') ||
      info?.type?.includes('presentation') ||
      info?.type?.includes('key')
    ) {
      return slidesSvg;
    } else if (
      info?.type?.includes('doc') ||
      info?.type?.includes('word') ||
      info?.type?.includes('pages')
    ) {
      return docsSvg;
    } else if (info?.type?.includes('video')) {
      return videoSvg;
    } else if (info?.type?.includes('text')) {
      return textSvg;
    }
    return pdfSvg;
  };

  return (
    <div className="col-auto">
      <img
        className={`avatar avatar-${size} avatar-4by3`}
        src={getSrc()}
        alt={info?.alt || 'File Icon'}
      />
    </div>
  );
};

FileIcon.defaultProps = {
  info: {},
  size: 'xs',
};

export default FileIcon;
