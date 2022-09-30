export default function Selected({
  usersSelected = [],
  onDelete,
  label = 'Suspend User',
}) {
  const moreClasses = !usersSelected?.length ? 'd-none' : '';

  return (
    <div
      id="datatableCounterInfo"
      className={`mr-2 mb-2 mb-sm-0 ${moreClasses}`}
    >
      <div className="d-flex align-items-center">
        <span className="font-size-sm mr-3">
          <span id="datatableCounter">
            {`${usersSelected.length} Selected`}
          </span>
        </span>
        <div className="btn btn-sm btn-outline-danger" onClick={onDelete}>
          <i className="material-icons-outlined">delete</i>
          {label}
        </div>
      </div>
    </div>
  );
}
