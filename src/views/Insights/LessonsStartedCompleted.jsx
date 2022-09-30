import { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import moment from 'moment';
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
import { Line } from 'react-chartjs-2';

import { tagsColorHex } from '../Deals/contacts/Contacts.constants';
import IdfDropdownSelect from '../../components/idfComponents/idfDropdown/IdfDropdownSelect';
import { InsightsQuery } from './components/InsightsQuery';

const ranges = {
  last_7_days: 7,
  last_30_days: 30,
};

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

const AnalyticData = ({ count, icon, label, border }) => {
  return (
    <Col className={border && 'border-md-left'}>
      <Row>
        <Col xs={3}>
          <span className="material-icons-outlined font-size-2xl text-primary">
            {icon}
          </span>
        </Col>

        <Col>
          <Row>{label}</Row>
          <Row className="fs-5">
            <strong>{count}</strong>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};

const LessonsStartedCompleted = ({ insight, insightName }) => {
  const [query, setQuery] = useState(insight);
  const [chartFilter, setChartFilter] = useState('Last 7 days');

  useEffect(() => {
    if (Object.keys(query).length > 0 && Array.isArray(query.timeDimensions)) {
      const [{ dateRange }] = query.timeDimensions;
      if (chartFilter.toLowerCase().startsWith(dateRange)) {
        return;
      }
      setQuery({
        ...query,
        timeDimensions: [
          {
            ...query.timeDimensions[0],
            dateRange: chartFilter,
          },
        ],
      });
    }
  }, [chartFilter]);

  return (
    <Card>
      <Card.Header>
        <Row className="pl-3 w-100 align-items-center">
          <Col>
            <h4 className="mb-0">{insightName}</h4>
          </Col>

          <Col className="col-auto p-0 d-flex justify-content-between">
            <IdfDropdownSelect
              icon="timer"
              list={['Last 7 days', 'Last 30 days', 'Last month']}
              onHandleChange={setChartFilter}
            />
          </Col>
        </Row>
      </Card.Header>

      <InsightsQuery
        query={query}
        setQuery={setQuery}
        render={(results) => {
          const { data } = results[0];

          const daysLabel = chartFilter.toLowerCase().replaceAll(' ', '_');

          let lastDays, startDate;
          const labels = [];
          const countsInProgress = [];
          const countsCompleted = [];

          if (daysLabel === 'last_month') {
            const currentMonth = moment().get('month');
            const currentYear = moment().get('year');

            const dateLastMonth =
              currentMonth === 0
                ? `${currentYear - 1}-12}`
                : `${currentYear}-${currentMonth}`;

            lastDays = moment(dateLastMonth).daysInMonth();
            startDate = moment(`${currentYear}/${currentMonth}/01`)
              .utc()
              .startOf('month');
          } else {
            lastDays = ranges[daysLabel];
            startDate = moment()
              .utc()
              .startOf('day')
              .subtract(lastDays + 1, 'days');
          }

          for (let i = 0; i < lastDays; i++) {
            if (daysLabel === 'last_month' && i === 0) {
              labels.push(startDate.format('MMM-DD'));
            } else {
              labels.push(startDate.add(1, 'days').format('MMM-DD'));
            }

            const todayProgress = data.filter((result) =>
              startDate
                .toISOString()
                .startsWith(result['LessonProgress.createdAt.day'])
            );

            const inProgress = todayProgress.find(
              (result) => result['LessonProgress.status'] === 'in_progress'
            );
            countsInProgress.push(
              inProgress ? Number(inProgress['LessonProgress.count']) : 0
            );

            const completed = todayProgress.find(
              (result) => result['LessonProgress.status'] === 'completed'
            );
            countsCompleted.push(
              completed ? Number(completed['LessonProgress.count']) : 0
            );
          }

          const chartData = {
            labels,
            datasets: [
              {
                label: 'Started',
                data: countsInProgress,
                borderColor: '#092ace',
                backgroundColor: '#092ace',
              },
              {
                label: 'Completed',
                data: countsCompleted,
                borderColor: '#ff5a2c',
                backgroundColor: '#ff5a2c',
              },
            ],
          };

          const total = data.reduce((acc, progress) => {
            return acc + Number(progress['LessonProgress.count']);
          }, 0);
          const completed = data.reduce((acc, progress) => {
            if (progress['LessonProgress.status'] !== 'completed') {
              return acc;
            }
            return acc + Number(progress['LessonProgress.count']);
          }, 0);
          const percentage = (completed * 100) / total || 0;

          const totalAvgs = data.reduce((acc, progress) => {
            return acc + (progress['LessonProgress.avgTimeToComplete'] || 0);
          }, 0);
          const average = totalAvgs / 60 / completed;
          const avgHours = Math.floor(average / 60) || 0;
          const avgMins = Math.floor(average % 60) || 0;

          return (
            <div>
              <Row className="mb-4">
                <AnalyticData
                  count={total - completed}
                  icon="monitor"
                  label="Started"
                />

                <AnalyticData
                  count={completed}
                  icon="done_all"
                  label="Completed"
                  border
                />

                <AnalyticData
                  count={
                    chartData
                      ? `${percentage.toFixed(2).replace(/.00+$/, '')}%`
                      : 0
                  }
                  icon="assessment"
                  label="Completion rate"
                  border
                />
                <AnalyticData
                  count={`${avgHours || '00'}h : ${avgMins || '00'}m`}
                  icon="schedule"
                  label="Average time to complete"
                  border
                />
              </Row>

              <div style={{ height: '400px' }}>
                <Line options={options} data={chartData} />
              </div>

              <div className="row justify-content-center mt-4 pt-4 border-top">
                <div className="col-auto">
                  <span
                    className={`legend-indicator`}
                    style={{ background: tagsColorHex.cold }}
                  ></span>
                  Started
                </div>

                <div className="col-auto">
                  <span
                    className={`legend-indicator`}
                    style={{ background: tagsColorHex.lost }}
                  ></span>
                  Completed
                </div>
              </div>
            </div>
          );
        }}
      />
    </Card>
  );
};

export default LessonsStartedCompleted;
