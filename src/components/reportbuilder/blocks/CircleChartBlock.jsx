import { Doughnut } from 'react-chartjs-2';
import React from 'react';

const CircleChartBlock = ({ text, data, options }) => {
  const config = {
    type: 'pie',
    data: {
      labels: data.labels,
      datasets: [
        {
          ...data.data,
          borderWidth: 1,
          hoverBorderColor: '#fff',
        },
      ],
    },
    options: {
      ...options,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
          },
        },
        tooltip: true,
      },
    },
  };

  return (
    <div className="position-relative">
      <Doughnut type="doughnut" options={config.options} data={config.data} />
      <p
        className="position-absolute font-size-2em font-weight-semi-bold"
        style={{
          left: '50%',
          transform: 'translate(-50%, -40%)',
          top: '40%',
          color: data?.data?.backgroundColor[0],
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default CircleChartBlock;
