import { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import RightPanelModal from '../../modal/RightPanelModal';
import IndustryInsight from './IndustryInsight';
import MaterialIcon from '../../commons/MaterialIcon';

const IndustryInsightPanel = ({
  insightModel,
  setShowInsightModel,
  naicsCode,
}) => {
  return (
    <RightPanelModal
      showModal={insightModel}
      setShowModal={setShowInsightModel}
      naicsCode={naicsCode}
      Title={
        <div className="d-flex py-2 align-items-center">
          <MaterialIcon
            icon="lightbulb"
            clazz="font-size-xl text-white bg-yellow icon-circle p-1 mr-2"
          />
          <h4 className="mb-0">Industry Insights</h4>
        </div>
      }
    >
      <IndustryInsight naicsCode={naicsCode} />
    </RightPanelModal>
  );
};

const InsightsPanel = ({ profileInfo, setRightBarOpen }) => {
  const [insightModel, setShowInsightModel] = useState(false);
  const [naicsCode, setNaicsCode] = useState('');

  useEffect(() => {
    if (profileInfo) {
      setNaicsCode(profileInfo?.naics_code);
    }
  }, [profileInfo]);

  const onLightbulbClick = (e) => {
    setShowInsightModel(true);
  };

  return (
    <>
      <OverlayTrigger
        key={'niacs'}
        placement="bottom"
        overlay={
          <Tooltip
            id={`tooltip-niacs}`}
            className={`tooltip-profile font-weight-bold`}
          >
            <p>Industry Insights</p>
          </Tooltip>
        }
      >
        <div className="nav-item mb-2" onClick={onLightbulbClick}>
          <div
            className={`nav-icon cursor-pointer ${naicsCode ? 'nav-icon' : ''}`}
          >
            <span className="material-icons-outlined text-white bg-yellow rounded-circle p-1">
              lightbulb
            </span>
          </div>
        </div>
      </OverlayTrigger>
      {insightModel && (
        <IndustryInsightPanel
          insightModel={insightModel}
          setShowInsightModel={setShowInsightModel}
          naicsCode={naicsCode}
          setRightBarOpen={setRightBarOpen}
        />
      )}
    </>
  );
};

export default InsightsPanel;
