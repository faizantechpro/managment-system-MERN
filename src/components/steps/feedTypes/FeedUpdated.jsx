import React from 'react';
import { Badge } from 'reactstrap';

import { isToFixedNoRound } from '../../../utils/Utils';
import { tagsColor } from '../../../views/Deals/contacts/Contacts.constants';
import stringConstants from '../../../utils/stringConstants.json';

const constants = stringConstants.feed.updateType;

const GetLabel = ({ title }) => {
  return (
    <h6 className="text-uppercase mb-0">
      {constants[title] ? constants[title] : title}:
    </h6>
  );
};

const PreviousItem = ({ isAmount, isStatus, previousValue }) => {
  let color = isStatus ? tagsColor[previousValue] : 'secondary';
  let className = isStatus ? 'text-uppercase' : '';
  if (isAmount) {
    color = '';
    className = 'text-danger';
  }

  return (
    <>
      <Badge color={color} style={{ fontSize: '12px' }} className={className}>
        {isAmount ? isToFixedNoRound(previousValue, 2) : previousValue}
      </Badge>

      <i className="material-icons-outlined ml-2 mr-2">arrow_forward</i>
    </>
  );
};

const CurrentValue = ({ isAmount, isStatus, currentValue }) => {
  let color = isStatus ? tagsColor[currentValue] : 'success';
  let className = isStatus ? 'text-uppercase' : '';
  if (isAmount) {
    color = '';
    className = 'text-success';
  }

  return (
    <Badge color={color} style={{ fontSize: '12px' }} className={className}>
      {isAmount ? isToFixedNoRound(currentValue, 2) : currentValue}
    </Badge>
  );
};

const updatesMap = (update) => {
  const isStatus = update.key === 'status' || update.key === 'deal_type';
  const isAmount = update.key === 'amount';

  return (
    <div key={update.key} className="mt-2">
      <GetLabel title={update.key} />
      {update.previousValue && (
        <PreviousItem
          isAmount={isAmount}
          isStatus={isStatus}
          previousValue={update.previousValue}
        />
      )}

      <CurrentValue
        isAmount={isAmount}
        isStatus={isStatus}
        currentValue={update.currentValue}
      />
    </div>
  );
};

const FeedUpdated = ({ updates }) => {
  return (
    <div className="card">
      <div className="card-body d-flex flex-column">
        {updates.map(updatesMap)}
      </div>
    </div>
  );
};

FeedUpdated.defaultProps = {
  updates: [],
};

export default FeedUpdated;
