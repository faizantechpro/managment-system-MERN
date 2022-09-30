import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import IdfIcon from '../idfComponents/idfIcon';

const ContentTemplate = ({ children, type, csvTemplate }) => {
  return (
    <Card>
      <Card.Header>
        Identifee allows you to bulk import {type} into your account by using a
        Comma-Separated Values (CSV) file. Please the instructions below to
        import a CSV file.
      </Card.Header>

      <Card.Body>
        <h3>
          <Badge variant="primary" className="icon-circle py-1">
            1
          </Badge>
          <span className="ml-2">Download Template</span>
        </h3>
        <p>
          {`
          We've created a custom CSV template based on your customer data
          attributes. This template will guide you how to structure your data
          for a successful import. Please DO NOT change the structure or
          position of the columns. If there is no value available for a
          column, leave that empty. We will take care of it while processing
          the file.
          `}
        </p>

        {csvTemplate && (
          <a
            href={csvTemplate}
            download={`import-${type}.csv`}
            className="btn btn-primary text-white"
          >
            <IdfIcon icon="file_download" className="mr-2" />
            Download Template
          </a>
        )}

        <h3 className="mt-4">
          <Badge variant="primary" className="icon-circle py-1">
            2
          </Badge>
          <span className="ml-2">Data Formatting</span>
        </h3>

        <p>
          Use the data formats listed below to help minimise errors and ensure
          your data is imported successfully.
        </p>

        <ul>
          <li>
            <strong>Dates</strong> - All dates must be formatted as MM/DD/YYYY.
          </li>
          <li>
            <strong>Phone Number</strong> -
            {` The preferred phone number format
            includes the phone's country code in E.164 format. If no country
            code is provided, it may be assumed based on the customer's country.`}
          </li>
          <li>
            <strong>Address</strong> - All parts of an address must be separated
            into individual columns, e.g. Street, City, State.
          </li>
          <li>
            <strong>Toggle/Boolean</strong> - The preferred format for toggles
            is Yes/No, but True/False is also supported.
          </li>
        </ul>

        {children}
      </Card.Body>
    </Card>
  );
};

export default ContentTemplate;
