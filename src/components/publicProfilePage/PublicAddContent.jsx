import React, { useState } from 'react';

import AddFile from '../peopleProfile/contentFeed/AddFile';
import OverviewPublicProfile from './OverviewPublicProfile';

const PublicAddContent = ({ organizationId, dataSection, ...props }) => {
  const [activeTab, setActiveTab] = useState(dataSection ? 1 : 2);

  const tabs = [
    {
      tabId: 1,
      icon: 'analytics',
      label: 'Overview',
    },
    {
      tabId: 2,
      icon: 'attach_file',
      label: 'Files',
    },
  ];

  const renderContent = () => {
    if (activeTab === 1) {
      return <OverviewPublicProfile {...props} />;
    } else if (activeTab === 2) {
      return <AddFile publicPage organizationId={organizationId} />;
    } else {
      return <span>Invalid tab</span>;
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header pb-0 px-0 border-bottom-0">
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

export default PublicAddContent;
