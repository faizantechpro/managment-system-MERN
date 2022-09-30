import { QueryRenderer } from '@cubejs-client/react';
import moment from 'moment';
import { cubeService } from '../../services';
import Loading from '../Loading';

export const AnalyticsQuery = ({ query = {}, setQuery = () => {}, render }) => {
  const {
    dimensions,
    limit,
    filters,
    measures,
    order,
    segments,
    timeDimensions,
  } = query;

  const validQuery = {
    dimensions,
    limit,
    filters,
    measures,
    order,
    segments,
    timeDimensions,
  };

  return (
    <>
      <QueryRenderer
        query={{ ...validQuery, timezone: moment.tz.guess() }}
        setQuery={setQuery}
        cubejsApi={cubeService.getCube()}
        resetResultSetOnChange={false}
        render={(props) => {
          if (props.error || !props.resultSet || props.loadingState.isLoading) {
            return <Loading />;
          }

          const {
            resultSet: {
              loadResponse: { results },
            },
          } = props;

          return render(results, query);
        }}
      />
    </>
  );
};
