import MaterialIcon from '../../../../components/commons/MaterialIcon';

const Percentage = ({ value }) => {
  const foreClass = value < 0 ? 'text-danger' : 'text-success';
  const bgClass = value < 0 ? 'bg-soft-danger' : 'bg-soft-success';
  return (
    <div className="d-flex font-size-sm2 align-items-center">
      <span>
        <MaterialIcon
          icon={value < 0 ? 'arrow_drop_down' : 'arrow_drop_up'}
          clazz={`mr-1 font-size-xs ${bgClass} ${foreClass}`}
        />
      </span>
      <span className={`${foreClass} font-weight-semi-bold`}>{value}%</span>
    </div>
  );
};

// this widget will be for "kpi_standard" displayType sent by API
const StatWidget = ({ data }) => {
  return (
    <div className="d-flex align-items-center px-0">
      <div>
        <h1 className="font-size-3em">{data.count}</h1>
      </div>
      <div className="ml-2">
        {data.percentage && (
          <p className="mb-0 pb-0">
            <Percentage value={data.percentage} />
          </p>
        )}
        {data.lastMonth && (
          <span className="text-muted font-size-xs">
            Last month: {data.lastMonth}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatWidget;
