const PipelineCard = ({
  children,
  title,
  classNameProp,
  onClick,
  noEditIcon,
  isPrincipalOwner,
}) => {
  return (
    <div className={`card ${classNameProp}`}>
      <div className="card-header">
        <h4 className="card-title">{title}</h4>
        {!noEditIcon && isPrincipalOwner && (
          <div className="ml-auto">
            <button
              className="btn btn-icon btn-sm btn-ghost-primary rounded-circle"
              title="Edit all fields"
              onClick={onClick}
            >
              <i className="material-icons-outlined">edit</i>
            </button>
          </div>
        )}
      </div>

      {children}
    </div>
  );
};

export default PipelineCard;
