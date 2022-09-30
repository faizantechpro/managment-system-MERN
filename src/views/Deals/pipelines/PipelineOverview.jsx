import { useState } from 'react';

import PipelineCard from './PipelineCard';
import PipelineForm from './PipelineForm';
import Alert from '../../../components/Alert/Alert';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import dealService from '../../../services/deal.service';
import {
  DEAL_TITLE,
  DEAL_UPDATED,
  PRIMARY_OWNER,
  SOMETHING_IS_WRONG,
  CANT_UPDATE_OVERVIEW_INFO,
} from '../../../utils/constants';
import { setDateFormat, isToFixedNoRound } from '../../../utils/Utils';

const PipelineOverview = ({ deal, getDeal, isPrincipalOwner }) => {
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { name, amount, date_closed, assigned_user } = deal || {};

  const onHandleSubmit = async (dealFormData) => {
    const {
      name,
      amount,
      currency,
      tenant_deal_stage_id,
      date_closed,
      assigned_user_id,
      sales_stage,
    } = dealFormData || {};

    const formOverview = {
      name,
      amount,
      currency,
      tenant_deal_stage_id,
      date_closed,
      assigned_user_id,
      sales_stage,
    };

    const resp = await dealService
      .updateDeal(deal.id, formOverview)
      .catch(() => setErrorMessage(SOMETHING_IS_WRONG));

    if (resp?.response?.data?.errors[0]?.message) {
      setEditMode(false);
      return setErrorMessage(CANT_UPDATE_OVERVIEW_INFO);
    }

    const { data } = resp || {};

    if (data.length) {
      setSuccessMessage(DEAL_UPDATED);
      getDeal();
      setEditMode(false);
    }
  };

  const pipelineInfo = () => {
    if (editMode)
      return (
        <PipelineForm
          setEditMode={setEditMode}
          deal={deal}
          onHandleSubmit={onHandleSubmit}
        />
      );

    return (
      <div className="card-body py-2">
        <ul className="list-group list-group-flush list-group-no-gutters">
          <li className="list-group-item d-flex align-items-center">
            <span className="text-muted">{DEAL_TITLE}</span>
            <span className="font-weight-medium ml-auto">{name}</span>
          </li>

          <li className="list-group-item d-flex align-items-center">
            <span className="text-muted">Value</span>
            <span className="font-weight-medium ml-auto">
              {isToFixedNoRound(amount, 2)}
            </span>
          </li>

          <li className="list-group-item d-flex align-items-center">
            <span className="text-muted">Expected Close Date</span>
            <span className="font-weight-medium ml-auto">
              {date_closed && setDateFormat(date_closed, 'YYYY-MM-DD')}
            </span>
          </li>

          <li className="list-group-item d-flex align-items-center">
            <span className="text-muted">{PRIMARY_OWNER}</span>
            <span className="font-weight-medium ml-auto">{`${
              assigned_user?.first_name || ''
            } ${assigned_user?.last_name || ''}`}</span>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <PipelineCard
        title="Overview"
        onClick={() => {
          setEditMode((prev) => !prev);
        }}
        isPrincipalOwner={isPrincipalOwner}
      >
        {pipelineInfo()}
      </PipelineCard>
      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
        <Alert
          color="success"
          message={successMessage}
          setMessage={setSuccessMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default PipelineOverview;
