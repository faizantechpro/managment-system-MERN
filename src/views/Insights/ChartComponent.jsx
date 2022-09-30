import { get, filter } from 'lodash';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';

import { stageOptions } from '../../components/peoples/Peoples.constants';
import { tagsColorHex } from '../Deals/contacts/Contacts.constants';
import { EMPTY_DATA } from '../../utils/constants';
import sorry from '../../assets/svg/illustrations/sorry.svg';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  barPercentage: 0.2,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context?.parsed?.y || 0} d`,
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
      ticks: {
        callback: (label) => `${label} days`,
      },
    },
  },
};

const ChartComponent = ({ queryFilters, resultSet }) => {
  const results = get(resultSet?.loadResponse, 'results[0].data');

  const labels = queryFilters?.map(
    (owner) => `${owner.first_name} ${owner.last_name}`
  );

  const getDiff = (dataLabel, field) => {
    const datesDiff = dataLabel.map((record) => {
      const startDate = moment(record[field]);
      const endDate = moment();

      let dateDiff = endDate.diff(startDate, 'days') || 0;

      if (dateDiff === 0) {
        dateDiff = 1;
      }

      return dateDiff;
    });

    const sum = datesDiff.reduce((accum, elem) => {
      return accum + elem;
    }, 0);

    const dateAvg = datesDiff?.length ? Math.round(sum / datesDiff?.length) : 0;

    return dateAvg;
  };

  const totalCount = (fields) =>
    fields.reduce((accum, elem) => {
      return accum + elem;
    }, 0);

  const dealsOpen = labels?.map((label) => {
    const dataLabel = filter(results, {
      'User.fullName': label,
    });

    const statusMap = stageOptions.reduce((accum, elem) => {
      if (elem.name !== 'won' && elem.name !== 'lost') {
        return {
          ...accum,
          [elem.name]: true,
        };
      } else {
        return {
          ...accum,
          [elem.name]: false,
        };
      }
    }, {});

    const datesDiff = dataLabel?.map((deal) => {
      if (statusMap[deal['Deal.dealType']]) {
        const startDate = moment(deal['Deal.dateEntered']);
        const endDate = moment();

        let dateDiff = endDate.diff(startDate, 'days') || 0;

        if (dateDiff === 0) {
          dateDiff = 1;
        }

        return dateDiff;
      } else {
        return 0;
      }
    });

    const sum = datesDiff.reduce((accum, elem) => {
      return accum + elem;
    }, 0);

    const dateAvg = datesDiff?.length ? Math.round(sum / datesDiff?.length) : 0;

    return dateAvg;
  });

  const dealsWon = labels.map((label) => {
    const dataLabel = filter(results, {
      'User.fullName': label,
      'Deal.dealType': 'won',
    });

    return getDiff(dataLabel, 'Deal.dateWonClosed');
  });

  const dealsLost = labels.map((label) => {
    const dataLabel = filter(results, {
      'User.fullName': label,
      'Deal.dealType': 'lost',
    });

    return getDiff(dataLabel, 'Deal.dateLostClosed');
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Open',
        data: dealsOpen,
        backgroundColor: tagsColorHex.cold,
      },
      {
        label: 'Won',
        data: dealsWon,
        backgroundColor: tagsColorHex.won,
      },
      {
        label: 'Lost',
        data: dealsLost,
        backgroundColor: tagsColorHex.lost,
      },
    ],
  };

  const sum =
    totalCount(dealsOpen) + totalCount(dealsWon) + totalCount(dealsLost);

  if (sum === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-spinner">
        <div className="w-25 text-center">
          <img src={sorry} width="100px" />
          <p>{EMPTY_DATA}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div>
        <Bar options={options} data={data} />
      </div>

      <div className="row justify-content-center mt-4 pt-4 border-top">
        <div className="col-auto">
          <span
            className={`legend-indicator`}
            style={{ background: tagsColorHex.cold }}
          ></span>
          Open
        </div>

        <div className="col-auto">
          <span
            className={`legend-indicator`}
            style={{ background: tagsColorHex.won }}
          ></span>
          Won
        </div>

        <div className="col-auto">
          <span
            className={`legend-indicator`}
            style={{ background: tagsColorHex.lost }}
          ></span>
          Lost
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
