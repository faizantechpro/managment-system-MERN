import * as chrono from 'chrono-node';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';

import { dealsData } from './InsightReports.constants';
import { generateArrayDates } from '../../utils/Utils';

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
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
};

const DealsPerformance = (results, query) => {
  const formatYYYYMMDD = 'YYYY-MM-DD';
  const formatMMMMYYYY = 'MMM YYYY';

  const getDateType = (dateRange) => {
    const { startDate, endDate } = dateRange;
    const startDay = moment(startDate);
    const endDay = moment(endDate);

    return endDay.diff(startDay, 'days') > 31 ? 'month' : 'day';
  };

  const { data } = results[0];

  const [{ dateRange }] = query.timeDimensions;
  const range = {};
  if (typeof dateRange === 'string') {
    const parsedRange =
      chrono.parseDate(dateRange) || moment().subtract(6, 'months');
    range.startDate = moment(parsedRange).format('YYYY-MM-DD');
    range.endDate = moment().format('YYYY-MM-DD');
  } else {
    range.startDate = moment(dateRange[0]).format('YYYY-MM-DD');
    range.endDate = moment(dateRange[1]).format('YYYY-MM-DD');
  }
  const dateType = getDateType(range);

  const format = dateType === 'day' ? formatYYYYMMDD : formatMMMMYYYY;
  const dates = generateArrayDates(
    range.startDate,
    range.endDate,
    dateType,
    format
  );

  const deals = dealsData.map(({ name, color }) => {
    const totalCount = dates.map((date) => {
      return data.reduce((acc, item) => {
        const dealDate = moment(item['Deal.dateModified']).format(format);

        const status = item['Deal.status'];
        const isWon = status === 'won';
        const isLost = status === 'lost';

        if (
          dealDate === date &&
          ((name === 'won' && isWon) ||
            (name === 'lost' && isLost) ||
            (name === 'open' && !isWon && !isLost))
        ) {
          return acc + Number(item['Deal.count']);
        }

        return acc;
      }, 0);
    });

    return {
      label: name,
      backgroundColor: color,
      data: totalCount,
    };
  });

  const chartData = {
    labels: dates,
    datasets: deals,
  };

  return (
    <>
      <div style={{ height: '400px' }}>
        <Bar options={options} data={chartData} />
      </div>
      <div className="row justify-content-center mt-4 pt-4 border-top">
        {dealsData.map((item) => (
          <div key={item.name} className="col-auto text-capitalize">
            <span
              className={`legend-indicator`}
              style={{ background: item.color }}
            ></span>
            {item.name}
          </div>
        ))}
      </div>
    </>
  );
};

export default DealsPerformance;
