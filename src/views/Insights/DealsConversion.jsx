import { Card, Row, Col } from 'react-bootstrap';
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';
import { get } from 'lodash';
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
import { Bar } from 'react-chartjs-2';

import { DEALS_CONVERSION } from '../../utils/constants';
import { stageOptions } from '../../components/peoples/Peoples.constants';
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

const options = {
  responsive: true,
  maintainAspectRatio: false,
  barPercentage: 0.05,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
};

const cubejsApi = cubejs(
  async () => {
    const creds = JSON.parse(localStorage.getItem('idftoken'));
    return `Bearer ${creds.access_token}`;
  },
  { apiUrl: `${window.location.origin}/api/analytics/v1`, method: 'POST' }
);

const DealsConversion = ({ className, onClickDashboard, disabled }) => {
  return (
    <Card className={className}>
      <Card.Header>
        <Row className="pl-3 w-100">
          <Col>
            <h4>{DEALS_CONVERSION}</h4>
          </Col>
          <Col className="col-auto">
            <ButtonIcon
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
          query={{
            dimensions: ['Deal.dealType'],
            timeDimensions: [],
            order: {
              'Deal.count': 'desc',
            },
            measures: ['Deal.count'],
            filters: [],
          }}
          cubejsApi={cubejsApi}
          resetResultSetOnChange={false}
          render={(props) => {
            const results = get(
              props.resultSet?.loadResponse,
              'results[0].data'
            );

            const resultsMap = results?.reduce(
              (accum, elem) => ({
                ...accum,
                [elem['Deal.dealType']]: true,
              }),
              {}
            );

            const dealsData = [];

            stageOptions?.forEach((status) => {
              if (resultsMap && resultsMap[status.name]) {
                const record = results?.find(
                  (elem) => elem['Deal.dealType'] === status.name
                );

                if (record)
                  dealsData.push({
                    count: record['Deal.count'],
                    background:
                      record['Deal.dealType'] === 'won'
                        ? '#27ae60'
                        : record['Deal.dealType'] === 'lost'
                        ? '#f44336'
                        : '#092ace',
                  });
              } else {
                dealsData.push(0);
              }
            });

            const dealsWon = results?.find(
              (deal) => deal['Deal.dealType'] === 'won'
            );

            const total = dealsData?.reduce((acc, { count }) => {
              return acc + Number(count || 0);
            }, 0);

            const avg = dealsWon
              ? ((dealsWon['Deal.count'] * 100) / total).toFixed(2)
              : 0;

            const data = {
              labels: stageOptions?.map((status) => status.title),
              datasets: [
                {
                  label: 'Deals',
                  data: dealsData?.map((deal) => deal.count),
                  backgroundColor: dealsData?.map((deal) => deal.background),
                },
              ],
            };

            return (
              <div style={{ width: '1220px' }}>
                <p>
                  Your conversion rate is <strong>{avg}%</strong>. To win one
                  deal, 3 deals should be added on average.
                </p>
                <div style={{ height: '400px' }}>
                  <Bar options={options} data={data} />
                </div>
              </div>
            );
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default DealsConversion;
