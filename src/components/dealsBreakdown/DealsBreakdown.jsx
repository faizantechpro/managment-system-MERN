import React, { useState, useEffect } from 'react';

import sorry from '../../assets/svg/illustrations/sorry.svg';
import DateRange from './DateRange';
import Chart from './Chart';
import { AnalyticsQuery } from '../analytics';

const DealsBreakdown = () => {
  const [dateRange, setDateRange] = useState(undefined);

  useEffect(() => {}, [dateRange]);

  return (
    <div className="card h-100">
      <div className="card-header">
        <h4 className="card-header-title">Deals Breakdown</h4>

        <DateRange setRange={setDateRange} disableDefaultRange />
      </div>

      <div className="card-body">
        <AnalyticsQuery
          query={{
            dimensions: ['DealStage.name'],
            filters: [
              {
                member: 'Deal.createdById',
                operator: 'equals',
                values: ['self'],
              },
            ],
            measures: ['Deal.uniqueCountOfTenantDealStageId'],
          }}
          render={(results) => {
            const [{ data }] = results;

            if (data.length === 0) {
              return (
                <div className="d-flex justify-content-center align-items-center h-spinner">
                  <div className="w-50 text-center">
                    <img src={sorry} width="100px" />
                    <p>No deals to display</p>
                  </div>
                </div>
              );
            }

            const colors = ['bg-blue', 'bg-yellow', 'bg-danger'];
            const stats = data.map((entry, idx) => {
              return {
                id: entry['DealStage.name'],
                name: entry['DealStage.name'],
                group: entry['DealStage.name'],
                value: Number(entry['Deal.uniqueCountOfTenantDealStageId']),
                color: colors[idx],
              };
            });

            return (
              <>
                <div className="center-item">
                  <Chart breakdownData={stats} />
                </div>

                <div className="row justify-content-center mt-2">
                  {stats.map((stat) => {
                    return (
                      <>
                        <div className="col-auto">
                          <span
                            className={`legend-indicator ${stat.color}`}
                          ></span>{' '}
                          {stat.name}
                        </div>
                      </>
                    );
                  })}
                </div>
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

export default DealsBreakdown;
