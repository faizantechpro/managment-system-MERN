import { Input, Spinner } from 'reactstrap';
import {
  BROWSE_FILE,
  CHOOSE_FILE,
  UPLOAD_PDF_TITLE,
} from '../../utils/constants';
import MaterialIcon from '../commons/MaterialIcon';
import { useState } from 'react';

const LessonAdminUploadPdf = (props) => {
  const { pdf, onLoadPdf, isLoading, setPdf } = props;
  const [dragActive, setDragActive] = useState(false);

  let pdfSize = (pdf?.size / 1024).toFixed(2);

  let pdfUnite = 'Kb';

  if (pdfSize > 1024) {
    pdfSize = (pdfSize / 1024).toFixed(2);
    pdfUnite = 'Mb';
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPdf(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <h6 className="form-label">{UPLOAD_PDF_TITLE}</h6>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`card bg-gray-200 rounded d-flex mb-3 pdf-section border-dashed-gray ${
          dragActive ? 'bg-gray-300' : ''
        }`}
      >
        {pdf && (
          <div className="p-2">
            <div className="card rounded pdf-selected-wrapper w-100 p-2">
              <div>
                <div className="pdf-card">
                  <div className="pdf-avatar rounded d-flex justify-content-center align-items-center">
                    {pdf?.name[0]}
                  </div>

                  <div>
                    <p className="pdf-card-title text-truncate w-75">
                      {pdf?.name}
                    </p>
                    <p className="pdf-card-description">
                      {pdfSize} {pdfUnite}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="position-absolute mx-1 my-1 cursor-pointer close-pdf"
                onClick={() => setPdf(null)}
              >
                <MaterialIcon icon="close" />
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="font-weight-medium form-label mb-0">
            <p className="mb-0">{CHOOSE_FILE}</p>
            <p className="mb-0">or</p>
            <p className="mb-1">drag n&apos; drop</p>
          </div>

          <Input
            type="file"
            accept="name/pdf"
            name={pdf?.name}
            id="pdf"
            onClick={(e) => {
              e.target.value = '';
            }}
            className="d-none"
            onChange={onLoadPdf}
          />

          <label htmlFor="pdf">
            <div className="btn btn-primary btn-sm bw-large">
              {isLoading ? <Spinner /> : BROWSE_FILE}
            </div>
          </label>
        </div>
      </div>
    </>
  );
};

export default LessonAdminUploadPdf;
