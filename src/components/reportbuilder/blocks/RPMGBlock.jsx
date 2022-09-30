import BaseBlock from './BaseBlock';
import React, { useEffect, useState } from 'react';
import IdfDropdown from '../../idfComponents/idfDropdown';
import BlockDescription from './BlockDescription';
import { useParams } from 'react-router-dom';
import organizationService from '../../../services/organization.service';
import naicsService from '../../../services/naics.service';
import { Doughnut } from 'react-chartjs-2';

const RPMGDonut = ({ chartData, percentage }) => {
  return (
    <div className="position-relative" style={{ height: 170 }}>
      {chartData.datasets[0].data?.length > 0 && (
        <>
          <Doughnut options={circleConfig.options} data={chartData} />
          <p
            className="position-absolute font-size-2em font-weight-semi-bold"
            style={{
              left: '50%',
              transform: 'translate(-50%, -30%)',
              top: '30%',
              color: percentage?.color,
            }}
          >
            {percentage?.value}%
          </p>
        </>
      )}
    </div>
  );
};

const chartColors = ['#ff5a2c', '#f2c94c', '#27ae60', '#092ace'];

const circleConfig = {
  type: 'pie',
  data: {
    labels: ['Cards', 'Checks', 'ACH', 'Wires'],
    datasets: [
      {
        data: [],
        borderWidth: 1,
        backgroundColor: chartColors,
        borderColor: chartColors,
        hoverBorderColor: '#fff',
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: 40,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
        },
      },
    },
  },
};

const RPMGBlock = ({ partner, showAdd, direction = '' }) => {
  const [transactionRange, setTransactionRange] = useState(undefined);
  const { organizationId } = useParams();

  const [percentage, setPercentage] = useState({ value: 'X' });
  const [chartData, setChartData] = useState({ ...circleConfig.data });
  const [transactionSummary, setTransactionSummary] = useState([]);

  const updateTransactionInfo = (transactionSummary) => {
    if (transactionSummary) {
      return [
        transactionSummary.all_card_platforms,
        transactionSummary.checks,
        transactionSummary.ach,
        transactionSummary.wire_transfer,
      ];
    }
    return null;
  };

  const processChartData = () => {
    if (transactionSummary?.length) {
      const foundItem = transactionSummary.find(
        (item) => item.transaction.range === transactionRange.value
      );

      const t = updateTransactionInfo(foundItem);
      const maxVal = t[0];

      setPercentage({
        value: maxVal,
        color: t && chartColors[0],
      });

      const newData = [
        {
          ...chartData.datasets,
          data: [t ? t[0] : 0, t ? t[1] : 0, t ? t[2] : 0, t ? t[3] : 0],
          backgroundColor: chartColors,
          borderColor: chartColors,
          hoverBorderColor: '#fff',
        },
      ];
      setChartData({ ...chartData, datasets: newData });
    }
  };

  const loadInsights = async () => {
    const data = await organizationService.getOrganizationById(organizationId);
    const rpmgResult = await naicsService.getNaicsRpmgSummary(data?.naics_code);

    const transactionSummary = rpmgResult?.transaction_summary;
    if (transactionSummary?.length > 0) {
      setTransactionSummary(transactionSummary);
      setTransactionRange({
        label: '$2,500 - $10,000',
        value: '2501-10000',
      });
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  useEffect(() => {
    processChartData();
  }, [transactionRange]);

  return (
    <BaseBlock
      showAdd={showAdd}
      partner={partner}
      direction={direction}
      dataBlock={<RPMGDonut chartData={chartData} percentage={percentage} />}
      textBlock={
        <>
          <div className="d-flex pb-3 align-items-center">
            <h5 className="mb-0">Range</h5>
            <IdfDropdown
              className="ml-2"
              variant={'white'}
              items={[
                { label: 'Up to $2,500', value: '<2500' },
                { label: '$2,500 - $10,000', value: '2501-10000' },
                { label: '$10,000 - $100,000', value: '10001-100000' },
                { label: 'Over $100,000', value: '>100001' },
              ]}
              onChange={(item) => setTransactionRange(item)}
              defaultValue={transactionRange?.value}
            />
          </div>
          <BlockDescription
            texts={[
              `On average, your peers pay (${
                percentage?.value
              }%) of all payables between ${
                transactionRange?.label || 'X'
              } by commercial card, providing a substantial increase in Days Payables.`,
              'Peers are leveraging commercial card to improve Working Capital.',
            ]}
          />
        </>
      }
    />
  );
};

export default RPMGBlock;
