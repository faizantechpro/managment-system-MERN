import React from 'react';
import { Link } from 'react-router-dom';

import { Badge } from 'reactstrap';
import { isToFixedNoRound } from '../../../utils/Utils';
import routes from '../../../utils/routes.json';
import { tagsColor } from '../../../views/Deals/contacts/Contacts.constants';

const FeedCreation = ({
  id,
  name,
  first_name,
  last_name,
  status,
  deal_type,
  amount,
  isDeal,
}) => {
  return (
    <div className="card">
      <div className="card-body d-flex pb-2">
        <div className="mr-2">
          <h5 className="mb-1">
            <Link
              className="text-block"
              to={!isDeal ? `${routes.pipeline}/${id}` : '#!'}
            >
              {name ? name || '' : `${first_name || ''} ${last_name || ''}`}
            </Link>
          </h5>
          {(status || deal_type) && (
            <Badge
              className="text-uppercase mb-3"
              color={tagsColor[status || deal_type]}
              style={{ fontSize: '12px' }}
            >
              {status || deal_type}
            </Badge>
          )}
          {Boolean(amount) && (
            <p className="text-primary font-weight-semi-bold mb-0 mt-1">
              {isToFixedNoRound(amount)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

FeedCreation.defaultProps = {
  name: '',
  status: '',
  deal_type: '',
  amount: '',
};

export default FeedCreation;
