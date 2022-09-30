// this widget will be for "kpi_rankings" displayType sent by API
const ListWidget = ({ data, listType }) => {
  return (
    <div>
      {data.map((item, index) => {
        return item.count > 0 ? (
          <div
            key={index}
            className={`d-flex font-size-sm2 align-items-center ${
              item.revenue ? 'py-2' : 'py-3'
            } px-4 border-bottom justify-content-between`}
          >
            <div className="d-flex font-weight-medium align-items-center">
              <span>{index + 1}.</span>
              <span className="ml-1">{item.name}</span>
            </div>
            <div>
              {item.revenue ? (
                <>
                  <p className="font-weight-medium font-size-xs mb-0">
                    {item.revenue}
                  </p>
                  <p className="text-muted font-size-xs text-right mb-0">
                    {item.count} {listType}
                  </p>
                </>
              ) : (
                <p className="text-muted text-right mb-0">
                  {item.count} {listType}
                </p>
              )}
            </div>
          </div>
        ) : (
          <></>
        );
      })}
    </div>
  );
};

export default ListWidget;
