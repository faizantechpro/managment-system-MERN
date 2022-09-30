import React, { useEffect, useState } from 'react';
import { findIndex } from 'lodash';
import { ProgressBar, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import stageService from '../../../services/stage.service';
import Avatar from '../../Avatar';
import routes from '../../../utils/routes.json';
import ActivitiesHistory from '../../ActivitiesHistory/ActivitiesHistory';
import stringConstant from '../../../utils/stringConstants.json';
import AlertWrapper from '../../Alert/AlertWrapper';
import Alert from '../../Alert/Alert';

const DealCard = ({ item, formatNumber, onGetDeals }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [stages, setStages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const constants = stringConstant.deals.contacts.profile;

  const responseActivity = (msg) => {
    onGetDeals();
    switch (msg) {
      case constants.activityAdded:
        return setSuccessMessage(constants.activityAdded);
      case constants.updatedActivity:
        return setSuccessMessage(constants.updatedActivity);
      case constants.activityError:
        return setErrorMessage(constants.activityError);
      case constants.errorUpdatedActivity:
        return setErrorMessage(constants.errorUpdatedActivity);
      default:
        return false;
    }
  };

  const getStages = async () => {
    const stages = await stageService.getStages();
    setStages(stages);
  };

  const classnames = (index, stages, currentDeal) => {
    const stageIndex = findIndex(stages, {
      id: currentDeal.tenant_deal_stage_id || 'cold',
    });

    if (index <= stageIndex) {
      if (item.status === 'lost') return 'bg-red';

      return 'bg-green';
    }

    return 'bg-gray-400';
  };

  useEffect(() => {
    setName(item.name);
    setAmount(formatNumber(item.amount, 2));
    getStages();
  }, []);

  return (
    <div className="border rounded row w-100 m-auto">
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <div className="col-12">
        <div className="d-flex">
          <div className="w-100">
            <Link to={`${routes.dealsPipeline}/${item.id}`} className="w-100">
              <h4 className="ml-auto mt-2">{name}</h4>
            </Link>

            <OverlayTrigger
              key={item?.id}
              placement="bottom"
              overlay={
                <Tooltip
                  id={`tooltip-${item?.id}`}
                  className={`tooltip-profile font-weight-bold`}
                >
                  <p>{`${item?.assigned_user?.first_name} ${item?.assigned_user?.last_name}`}</p>
                </Tooltip>
              }
            >
              <div className="media pb-2">
                <Link
                  to={`${routes.contacts}/${item.id}/profile`}
                  className="cursor-pointer"
                >
                  <Avatar user={item?.assigned_user} defaultSize="xs" />
                </Link>
                <h6 className="mr-auto mt-1 ml-2">{amount}</h6>
              </div>
            </OverlayTrigger>
          </div>
          <span className="mt-1" onClick={(e) => e.stopPropagation()}>
            <ActivitiesHistory
              className="material-icons-outlined"
              icon={'today'}
              organizationId={item?.organization?.id}
              response={responseActivity}
              dealId={item?.id}
              activities={item?.activities}
            />
          </span>
        </div>
        <ProgressBar className="mb-2" style={{ height: '10px' }}>
          {stages?.map((stage, index) => {
            return (
              <ProgressBar
                key={stage.id}
                className={classnames(index, stages, item)}
                now={100 / stages.length}
                isChild={true}
                style={
                  stages.length !== index && {
                    borderRight: '3px solid #fff',
                    borderRadius: '0 50px 50px 0',
                  }
                }
              />
            );
          })}
        </ProgressBar>
      </div>
    </div>
  );
};
export default DealCard;
