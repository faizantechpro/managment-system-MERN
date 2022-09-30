export default function SectionHeader({
  title,
  buttonLabel,
  onHandleCreate,
  onDelete,
  selectedData,
  dataInDB,
}) {
  return (
    <div className="card-header">
      <h3 className="card-title h4">{title}</h3>

      <div className="card-header">
        {selectedData.length > 0 && (
          <div className={`mr-2 mb-2 mb-sm-0`}>
            <div className="d-flex align-items-center">
              <span className="font-size-sm mr-3">
                <span>{`${selectedData.length} Selected`}</span>
              </span>
              <div
                className="btn btn-sm btn-outline-danger"
                onClick={onDelete.bind(null, selectedData)}
              >
                <i className="material-icons-outlined">delete</i>
                Delete
              </div>
            </div>
          </div>
        )}

        {dataInDB && (
          <button
            className="btn btn-primary btn-sm"
            data-toggle="modal"
            onClick={onHandleCreate}
          >
            <span className="material-icons-outlined">add</span>
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
