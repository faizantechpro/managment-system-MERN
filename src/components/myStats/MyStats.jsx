import React from 'react';
import { Row, Col } from 'react-bootstrap';

import StatsItem from './StatsItem';
import { isToFixedNoRound } from '../../utils/Utils';
import { AnalyticsQuery } from '../analytics';

const MyStats = () => {
  return (
    <div className="card h-100">
      <div className="card-header">
        <h4 className="card-header-title">Stats</h4>
      </div>

      <div>
        <AnalyticsQuery
          query={{
            dimensions: [],
            filters: [
              {
                member: 'Deal.createdById',
                operator: 'equals',
                values: ['self'],
              },
            ],
            measures: [
              'Deal.count',
              'Deal.sumOfRevenue',
              'Deal.sumOfPendingRevenue',
              'Deal.countOfWon',
            ],
            order: [],
            timeDimensions: [],
          }}
          render={(results) => {
            const [
              {
                data: [stats],
              },
            ] = results;

            return (
              <div className="card-body">
                <Row>
                  <Col sm={6} lg>
                    <StatsItem
                      title="Total Deals"
                      icon="monetization_on"
                      body={stats['Deal.count'] || '0'}
                    />
                  </Col>
                  <Col sm={6} lg className="column-divider-lg">
                    <StatsItem
                      title="Won Deals"
                      icon="monetization_on"
                      body={stats['Deal.countOfWon'] || '0'}
                    />
                  </Col>
                  <Col sm={6} lg className="column-divider-lg">
                    <StatsItem
                      title="Total Revenue"
                      icon="payments"
                      body={isToFixedNoRound(stats['Deal.sumOfRevenue' || 0])}
                    />
                  </Col>
                  <Col sm={6} lg className="column-divider-lg">
                    <StatsItem
                      title="Expected Revenue"
                      icon="assessment"
                      body={isToFixedNoRound(
                        stats['Deal.sumOfPendingRevenue' || 0]
                      )}
                    />
                  </Col>
                </Row>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default MyStats;
