const PartnerLogoBlock = ({ logo, placement, style = { width: 70 } }) => {
  return (
    <>
      {logo ? (
        <div className={`inline-block ${placement}`}>
          <div className="d-flex align-items-center">
            <span className="text-muted font-size-xs mr-1">Data</span>
            <img src={logo} style={{ ...style, objectFit: 'contain' }} />
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default PartnerLogoBlock;
