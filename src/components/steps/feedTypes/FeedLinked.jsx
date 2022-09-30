import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../Avatar';

const FeedFile = ({ data, profileUrl }) => (
  <>
    <div className="card">
      <div className="card-body py-2">
        <ul className="list-group list-group-flush list-group-no-gutters">
          <li className="list-group-item">
            <div className="row align-items-center gx-2">
              <div className="col col-auto">
                <Avatar user={data} deafultSize="md" />
              </div>
              <div className="col">
                <h5 className="mb-1">
                  <Link to={profileUrl}>
                    <div className="text-block cursor-pointer">
                      {data?.name || `${data?.first_name} ${data?.last_name}`}
                    </div>
                  </Link>
                </h5>
                {data?.email_work ||
                  data?.email_personal ||
                  data?.email_other ||
                  ''}
                {data?.address_street ? `${data?.address_street}, ` : ''}
                {data?.address_city ? `${data?.address_city}, ` : ''}
                {data?.address_state || ''}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </>
);

FeedFile.defaultProps = {
  data: {},
};

export default FeedFile;
