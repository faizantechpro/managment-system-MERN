const ProgressBarItem = ({ values }) => {
  return (
    <div>
      {values.map((val) => (
        <div
          key={val.id}
          className="d-flex py-2 px-4 border-bottom w-100 align-items-center"
        >
          <div
            className="font-size-sm2 font-weight-medium"
            style={{ minWidth: 100 }}
          >
            {val.name}
          </div>
          <div className="ml-2 w-100 flex-grow-1">
            {val.values.map((child) => (
              <div key={child.id} className="d-flex w-100 align-items-center">
                <div
                  className={`${child.color} rounded`}
                  style={{ height: 10, width: child.value + '%' }}
                ></div>
                <span className="text-muted font-size-xs ml-2">
                  {child.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ProgressWidget = ({ data }) => {
  return (
    <div>
      <div className="border-bottom py-2">
        <ul className="list-unstyled list-inline my-0 px-4 py-2">
          {data.headers.map((item) => (
            <li className="list-inline-item" key={item.id}>
              <div className="d-flex align-items-center mr-2">
                <span className="font-size-sm2">{item.name}</span>
                <span
                  className={`${item.color} ml-2 rounded-circle d-inline-block`}
                  style={{ height: 10, width: 10 }}
                ></span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="progress-values">
        <ProgressBarItem values={data.data} />
      </div>
    </div>
  );
};

export default ProgressWidget;
