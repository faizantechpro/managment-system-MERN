import TreasuryReport from '../peopleProfile/contentFeed/TreasuryReport';
import PublicProfileTabs from './PublicProfileTabs';

const OverviewPublicProfile = (props) => {
  const { reportData } = props;

  const renderReportTypeTab = () => {
    if (!reportData)
      return (
        <p className="d-flex p-4 justify-content-center fs-4">
          No available reports at this time
        </p>
      );

    return <PublicProfileTabs {...props} />;
  };

  return (
    <div className="mx-4 my-5">
      {renderReportTypeTab()}

      {reportData && <TreasuryReport {...reportData} />}
    </div>
  );
};

export default OverviewPublicProfile;
