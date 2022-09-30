export const Card = ({ children, className }) => {
  const additionalClassNames = className || '';
  return (
    <div className={`card mt-4 mb-4 ${additionalClassNames}`}>{children}</div>
  );
};

export const CardHeader = ({ title, children }) => (
  <div className="card-header">
    <h4 className="card-title">{title}</h4>
    {children}
  </div>
);

export const CardBody = ({ children }) => (
  <div className="card-body toggle-org p-0">{children}</div>
);

export const CardFooter = ({ children }) => (
  <div className="card-footer">{children}</div>
);

export const CardList = ({ children }) => (
  <ul className="list-group list-group-flush list-group-no-gutters">
    {children}
  </ul>
);

export const CardItem = ({ children }) => (
  <li className="list-group-item py-3 pl-4 pr-2 item cursor-default">
    {children}
  </li>
);

export const ButtonRounded = ({ onClick, icon }) => {
  return (
    <button
      className={`btn btn-icon btn-sm btn-ghost-primary rounded-circle`}
      onClick={onClick}
    >
      <i className="material-icons-outlined">{icon}</i>
    </button>
  );
};

export const Button = ({ text, onClick, icon }) => {
  return (
    <button className={`btn btn-white btn-sm`} onClick={onClick}>
      {text}
      <i className="material-icons-outlined">{icon}</i>
    </button>
  );
};
