import React, { useEffect, useState } from 'react';
import { Alert, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Heading from '../heading';
import BulkImportService from '../../services/bulkImport.service';
import csvOrgTemplate from '../../assets/csv/import-organizations.csv';
import csvPeopleTemplate from '../../assets/csv/import-people.csv';
import csvDealsTemplate from '../../assets/csv/import-deals.csv';
import IdfIcon from '../idfComponents/idfIcon';
import { SwitchInput } from '../layouts/CardLayout';
import { CSVLink } from 'react-csv';
import ContentTemplate from './ContentTemplate';

const BulkImport = () => {
  const { type } = useParams();
  const [csvTemplate, setCsvTemplate] = useState(undefined);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [importResult, setImportResult] = useState(undefined);

  const onChange = async (e) => {
    try {
      const service = new BulkImportService();
      const file = e.target.files[0];
      const formData = new FormData();

      formData.append('file', file, file.name);
      const { itemsFailed, totalItems } = await service.bulkImport(
        formData,
        type,
        { updateExisting }
      );

      const successMessage = `Success! ${totalItems} ${type} have been processed. ${
        totalItems - itemsFailed.length
      } ${type} were imported successfully.`;
      if (totalItems === itemsFailed.length) {
        setImportResult({
          success: false,
          message: `Error! No ${type} were imported successfully. Please follow
          the template provided.`,
        });
      } else if (itemsFailed.length > 0) {
        setImportResult({
          success: true,
          message: `${successMessage} ${itemsFailed.length} ${type} had data errors and could not be imported.
          To download the failed ${type} data, please click the button below.`,
          itemsFailed,
        });
      } else {
        setImportResult({
          success: true,
          message: successMessage,
        });
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: `Error! No ${type} were imported successfully. Please follow
        the template provided.`,
      });
    }
  };

  useEffect(() => {
    switch (type) {
      case 'organizations':
        setCsvTemplate(csvOrgTemplate);
        break;
      case 'people':
        setCsvTemplate(csvPeopleTemplate);
        break;
      case 'deals':
        setCsvTemplate(csvDealsTemplate);
        break;

      default:
        break;
    }
  }, [type]);

  return (
    <div>
      <Heading title={`Import ${type}`} />

      <ContentTemplate type={type} csvTemplate={csvTemplate}>
        <h3>
          <Badge variant="primary" className="icon-circle py-1">
            3
          </Badge>
          <span className="ml-2">Upload File</span>
        </h3>
        <p>
          {type === 'organizations' &&
            `The only required field is the organization name. Organizations are
            identified by their name. If a organization with the same name already
            exists in your account, then a new organization will not be created.`}
          {type === 'people' &&
            `The only required field is the people email address. Customers are
          identified by their email addresses. If a people with the same email
          address already exists in your account, then a new people will not be
          created`}
        </p>
        <p>
          However, you can choose to update existing organizations data by
          checking the Update existing organization checkbox below.
        </p>

        <SwitchInput
          id="updateExisting"
          label={`Update Existing ${type}`}
          checked={updateExisting}
          onChange={(e) => {
            setUpdateExisting(e.target.checked);
          }}
        />

        <br />
        {!importResult && (
          <div className="position-relative">
            <div
              id="file"
              className="js-dropzone dropzone-custom custom-file-boxed"
            >
              <div className="dz-message custom-file-boxed-label">
                <IdfIcon icon="file_upload" style={{ fontSize: '5rem' }} />
                <h5>Browse a CSV file to upload</h5>
                <span className="text-muted">
                  Files must be formatted as a .CSV file.
                </span>
              </div>
            </div>

            <input
              className="file-input-drag"
              type="file"
              name="file"
              id="file"
              accept=".csv"
              onChange={onChange}
            />
          </div>
        )}
        {importResult && (
          <>
            <Alert variant={importResult?.success ? 'success' : 'danger'}>
              {importResult?.message}
            </Alert>
            {importResult?.itemsFailed?.length > 0 && (
              <CSVLink
                data={importResult.itemsFailed}
                className="btn btn-primary text-white"
                filename="failed-import.csv"
              >
                <IdfIcon icon="file_download" className="mr-2" />
                Download Failed {type}
              </CSVLink>
            )}
          </>
        )}
      </ContentTemplate>
    </div>
  );
};

export default BulkImport;
