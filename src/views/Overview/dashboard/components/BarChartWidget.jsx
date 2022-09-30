import { Bar } from 'react-chartjs-2';
import React from 'react';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  borderRadius: 12,
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
      ticks: {
        maxRotation: 0,
        minRotation: 0,
      },
      grid: {
        display: false,
      },
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
      position: 'right',
    },
  },
};

const BarChartWidget = ({ type = 'compressed' }) => {
  const barThickness = type === 'compressed' ? 0.8 : 0.25;
  const chartData = {
    labels: [
      'Mar 2022',
      'Apr 2022',
      'May 2022',
      'Jun 2022',
      'Jul 2022',
      'Aug 2022',
      'Sep 2022',
    ],
    datasets: [
      {
        label: 'open',
        backgroundColor: '#082ace',
        data: [0, 0, 4, 0, 7, 12, 28],
      },
      {
        label: 'lost',
        backgroundColor: '#28ae60',
        data: [20, 10, 0, 0, 0, 0, 0],
      },
      {
        label: 'won',
        backgroundColor: '#FF5A2D',
        data: [0, 0, 0, 10, 22, 0, 1],
      },
    ],
  };
  return (
    <Bar
      options={{ ...options, barPercentage: barThickness }}
      data={chartData}
    />
  );
};

export default BarChartWidget;
