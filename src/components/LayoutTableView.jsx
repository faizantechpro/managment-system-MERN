import SectionHeader from './SectionHeader';

const LayoutTableView = ({
  headerTitle,
  buttonLabel,
  toggle,
  children,
  cleaned,
  selectedData,
  onDelete,
  dataInDB,
}) => {
  return (
    <div className="card">
      {!cleaned && (
        <SectionHeader
          title={headerTitle}
          buttonLabel={buttonLabel}
          onHandleCreate={toggle}
          cleaned={cleaned}
          selectedData={selectedData}
          onDelete={onDelete}
          dataInDB={dataInDB}
        />
      )}
      <div className="card-body p-0">{children}</div>
    </div>
  );
};

LayoutTableView.defaultProps = {
  selectedData: [],
  onDelete: () => {},
};

export default LayoutTableView;
