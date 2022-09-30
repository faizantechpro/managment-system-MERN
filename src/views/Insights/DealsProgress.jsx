import React from 'react';
import { QueryRenderer } from '@cubejs-client/react';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import { Card, Col } from 'react-bootstrap';

import Loading from '../../components/Loading';
import { generateArrayDates } from '../../utils/Utils';
import { dealsListProgress } from './InsightReports.constants';
import ButtonIcon from '../../components/commons/ButtonIcon';
import { cubeService } from '../../services/cube.service';

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  barPercentage: 0.3,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      position: 'nearest',
      callbacks: {
        label: function ({ raw }) {
          return raw;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};
const DealsProgress = ({ className, onClickDashboard, disabled }) => {
  const formatYYYYMMDD = 'YYYY-MM-DD';
  const formatMMMMYYYY = 'MMM YYYY';

  const lastSixRange = {
    endDate: moment().format(formatYYYYMMDD),
    startDate: moment().subtract(5, 'months').format('YYYY-MM-01'),
  };

  const query = {
    measures: ['Deal.count'],
    timeDimensions: [
      {
        dimension: 'Deal.dateModified',
        granularity: 'month',
        dateRange: [lastSixRange.startDate, lastSixRange.endDate],
      },
    ],
    order: {
      'Deal.count': 'desc',
    },
    dimensions: ['Deal.dealType'],
    filters: [],
    limit: 5000,
  };

  return (
    <>
      <Card className={className}>
        <Card.Header>
          <Col>
            <h4 className="pl-3">Deals Progress</h4>
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
        </Card.Header>
        <Card.Body>
          <QueryRenderer
            cubejsApi={cubeService.getCube()}
            query={query}
            render={({ resultSet }) => {
              if (!resultSet) {
                return <Loading />;
              }

              const dates = generateArrayDates(
                lastSixRange.startDate,
                lastSixRange.endDate,
                'month',
                formatMMMMYYYY
              );

              const result = resultSet?.loadResponses[0]?.data;

              const dealsCount = {};

              dates.forEach((date) => {
                dealsCount[date] = dealsListProgress.map(({ name }) => {
                  return Number(
                    result.find((item) => {
                      return (
                        moment(item['Deal.dateModified']).format(
                          formatMMMMYYYY
                        ) === date && item['Deal.dealType'] === name
                      );
                    })?.['Deal.count'] || 0
                  );
                });
              });

              const data = {
                labels: dates,
                datasets: dealsListProgress.map(({ name, color }, index) => ({
                  label: name,
                  data: dates.map((date) => dealsCount[date][index]),
                  backgroundColor: color,
                })),
              };

              return (
                <>
                  <div style={{ height: '400px' }}>
                    <Bar options={options} data={data} />
                  </div>
                  <div className="row justify-content-center mt-4 pt-4 border-top">
                    {dealsListProgress.map((item) => (
                      <div key={item.name} className="col-auto">
                        <span
                          className={`legend-indicator text-capitalize`}
                          style={{ background: item.color }}
                        ></span>
                        {item.title}
                      </div>
                    ))}
                  </div>
                </>
              );
            }}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default DealsProgress;
