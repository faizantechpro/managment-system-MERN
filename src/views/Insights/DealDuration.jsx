import { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';
import { filter } from 'lodash';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { DEALS_DURATION } from '../../utils/constants';
import AlertWrapper from '../../components/Alert/AlertWrapper';
import Alert from '../../components/Alert/Alert';
import IdfSelectUserWithCheckbox from '../../components/idfComponents/idfDropdown/IdfSelectUserWithCheckbox';
import userService from '../../services/user.service';
import ChartComponent from './ChartComponent';
import ButtonIcon from '../../components/commons/ButtonIcon';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const cubejsApi = cubejs(
  async () => {
    const creds = JSON.parse(localStorage.getItem('idftoken'));
    return `Bearer ${creds.access_token}`;
  },
  { apiUrl: `${window.location.origin}/api/analytics/v1`, method: 'POST' }
);

const DealsDuration = ({ className, onClickDashboard, disabled }) => {
  const [ownerList, setOwnerList] = useState([]);
  const [warningMessage, setWarningMessage] = useState('');
  const [queryFilters, setQueryFilters] = useState([]);

  useEffect(async () => {
    const response = await userService
      .getUsers(
        { ...filter, status: 'active' },
        {
          limit: 5,
          order: [['DESC']],
        }
      )
      .catch((err) => err);

    const { data } = response || {};

    setQueryFilters(data?.users?.map((item) => item));
    setOwnerList(data?.users?.map((item) => item));
  }, []);

  const onSetOwner = async (e) => {
    const newOwnerList = ownerList.slice();

    const exist = newOwnerList.find((item) => item?.id === e.target.value);

    if (!exist && ownerList.length > 4) {
      return setWarningMessage('You cant have more than 5 owners selected');
    }
    if (exist && ownerList.length < 2) {
      return setWarningMessage('You must have at least 1 owner selected');
    } else if (exist && ownerList.length > 1) {
      return setOwnerList(
        newOwnerList.filter((owner) => owner.id !== exist?.id)
      );
    } else {
      const ownerInfo = await userService.getUserById(e.target.value);

      if (ownerInfo) {
        newOwnerList.push(ownerInfo);
      }
    }
    setOwnerList(newOwnerList);
  };

  const applyFilter = () => {
    setQueryFilters(ownerList);
  };

  const queryChart = {
    dimensions: [
      'User.fullName',
      'Deal.dealType',
      'Deal.assignedUserId',
      'Deal.dateWonClosed',
      'Deal.dateLostClosed',
      'Deal.dateEntered',
    ],
    timeDimensions: [],
    order: {
      'Deal.count': 'desc',
    },
    measures: ['Deal.count'],
    filters: [],
  };

  const renderChart = ({ resultSet }) => {
    return <ChartComponent resultSet={resultSet} queryFilters={queryFilters} />;
  };

  return (
    <>
      <Card className={className}>
        <Card.Header>
          <Row className="pl-3 w-100 d-flex align-items-center">
            <Col>
              <h4>{DEALS_DURATION}</h4>
            </Col>
            <Col className="col-auto p-0 d-flex justify-content-between w-35">
              <IdfSelectUserWithCheckbox
                className="w-100 mb-0"
                id="assigned_user_id"
                onChange={onSetOwner}
                showAvatar
                noDefault
                checkedList={ownerList}
                setCheckedList={setOwnerList}
                applyFilter={applyFilter}
              />
              <ButtonIcon
                classnames="ml-1"
                icon="dashboard_customize"
                color="white"
                label={null}
                onclick={onClickDashboard}
                disabled={disabled}
              />
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="overflow-x-auto">
          <QueryRenderer
            query={queryChart}
            cubejsApi={cubejsApi}
            resetResultSetOnChange={false}
            render={renderChart}
          />
        </Card.Body>
      </Card>

      <AlertWrapper>
        <Alert
          color="danger"
          message={warningMessage}
          setMessage={setWarningMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default DealsDuration;
