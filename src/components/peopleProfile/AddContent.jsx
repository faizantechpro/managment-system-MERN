import React, { useEffect, useState } from 'react';

import AddNote from './contentFeed/AddNote';
import AddFile from './contentFeed/AddFile';
import stringConstants from '../../utils/stringConstants.json';
import AddActivity from './contentFeed/AddActivity';
import AddDataReport from './contentFeed/AddDataReport';
import { useTenantContext } from '../../contexts/TenantContext';

const constants = stringConstants.deals.contacts.profile;

const AddContent = ({
  contactId,
  getProfileInfo,
  organizationId,
  dealId,
  getDeal,
  dataSection,
  profileInfo,
  contactIs,
  refreshRecentFiles,
  setRefreshRecentFiles,
  contactInfo,
  isPrincipalOwner,
  me,
}) => {
  const [activeTab, setActiveTab] = useState(2);
  const [openNote, setOpenNote] = useState(false);
  const [tabs, setTabs] = useState([
    {
      tabId: 2,
      icon: 'text_snippet',
      label: constants.notesLabel,
    },
    {
      tabId: 3,
      icon: 'event',
      label: constants.activityLabel,
    },
    {
      tabId: 4,
      icon: 'attachment',
      label: constants.filesLabel,
    },
  ]);
  const { tenant } = useTenantContext();

  const notePlaceholder = (
    <div
      className="cursor-pointer text-muted"
      style={{ backgroundColor: '#FFF8BC' }}
    >
      {openNote ? '' : 'Start writing a note...'}
    </div>
  );
  useEffect(() => {
    const dataTabFlag = tenant?.settings?.organizations?.dataTab;
    if (dataSection && (dataTabFlag === undefined || dataTabFlag === true)) {
      tabs[0].label !== 'Data' &&
        setTabs((prev) => [
          {
            tabId: 1,
            icon: 'analytics',
            label: `Data`,
          },
          ...prev,
        ]);
      setActiveTab(1);
    }
  }, []);

  const renderContent = () => {
    if (activeTab === 1) {
      return (
        <AddDataReport
          getProfileInfo={getProfileInfo}
          organizationId={organizationId}
          profileInfo={profileInfo}
          isPrincipalOwner={isPrincipalOwner}
        />
      );
    } else if (activeTab === 2) {
      return (
        <div className="px-4 py-2" onClick={() => setOpenNote(true)}>
          <AddNote
            setOverlay={setOpenNote}
            contactId={contactId}
            organizationId={organizationId}
            getProfileInfo={getProfileInfo}
            dealId={dealId}
            getDeal={getDeal}
            placeholder={notePlaceholder}
          />
        </div>
      );
    } else if (activeTab === 3) {
      return (
        <div className="p-4">
          <AddActivity
            componentId="new-activity"
            contactId={contactId}
            organizationId={organizationId}
            dealId={dealId}
            getProfileInfo={getProfileInfo}
            contactIs={contactIs}
            contactInfo={contactInfo}
            profileInfo={profileInfo}
          />
        </div>
      );
    } else if (activeTab === 4) {
      return (
        <AddFile
          contactId={contactId}
          organizationId={organizationId}
          getProfileInfo={getProfileInfo}
          dealId={dealId}
          getDeal={getDeal}
          refreshRecentFiles={refreshRecentFiles}
          setRefreshRecentFiles={setRefreshRecentFiles}
          me={me}
        />
      );
    } else {
      return <span>Invalid tab</span>;
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header py-0 px-0 pt-0 border-bottom-0">
          <ul
            className="nav nav-tabs nav-justified link-active-wrapper w-100 nav-sm-down-break"
            role="tablist"
          >
            {tabs.map((item) => {
              return (
                <li className="nav-item" key={item.tabId}>
                  <a
                    className={`nav-link ${
                      activeTab === item.tabId ? 'active' : ''
                    }`}
                    role="tab"
                    onClick={() => {
                      setActiveTab(item.tabId);
                    }}
                  >
                    <i className="material-icons-outlined nav-icon mr-1">
                      {item.icon}
                    </i>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-0">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AddContent;
