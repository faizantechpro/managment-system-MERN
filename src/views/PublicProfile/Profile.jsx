import React, { useContext, useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { useHistory } from 'react-router';
import classnames from 'classnames';
import Heading from '../../components/heading';
import { TabsContext } from '../../contexts/tabsContext';
import AddFile from '../../components/peopleProfile/contentFeed/AddFile';
import DataTabe from '../../components/PublicProfileTabs/DataTab';
import { PublicVideo } from '../../components/PublicProfileTabs/Video.jsx';
const TabTitle = ({ icon, title }) => (
  <div className="d-flex align-items-center tab-title">
    <span className="material-icons-outlined m-1 ">{icon}</span>
    <span>{title}</span>
  </div>
);

const Profile = () => {
  const [activeTab, setActiveTab] = useState(1);
  const history = useHistory();
  const { activatedTab, setActivatedTab } = useContext(TabsContext);

  useEffect(() => {
    if (activatedTab[location.pathname]) {
      setActiveTab(activatedTab[location.pathname]);
    }
    const tab = new URLSearchParams(history.location.search).get('tab');
    if (tab === 'video') {
      setActiveTab(2);
    }
  }, []);

  const tabsData = [
    {
      title: <TabTitle icon="analytics" title="Data" />,
      component: <DataTabe />,
      tabId: 1,
    },
    {
      title: <TabTitle icon="video_library" title="Videos" />,
      component: <PublicVideo />,
      tabId: 2,
    },
  ];

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);

      setActivatedTab({
        [location.pathname]: tab,
      });
    }
  };
  return (
    <>
      <div className="row public-main-content">
        <div className="col-12">
          <Heading
            title="Wolfs Crop"
            pageHeaderDivider="mb-0"
            useBc={true}
            icon="corporate_fare"
            showGreeting
          />
        </div>
        <div className="col-lg-7 mt-3">
          <div className="bg-white rounded shadow px-3 pb-2">
            <Nav tabs>
              {tabsData.map((item) => (
                <NavItem key={item.tabId}>
                  <NavLink
                    className={classnames({ active: activeTab === item.tabId })}
                    onClick={() => {
                      toggle(item.tabId);
                    }}
                  >
                    {item.title}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent>
              <TabPane>
                {tabsData.find((item) => item.tabId === activeTab)?.component}
              </TabPane>
            </TabContent>
          </div>
        </div>
        <div className="col-lg-5 pl-lg-0 mt-3">
          <div className="bg-white rounded shadow">
            <h3 className="public-file-heading mb-0 p-3">
              <span className="material-icons-outlined">attach_file</span>
              File
            </h3>
            <hr className="mt-0 mb-0" />
            <div className="public-drag-drop">
              <AddFile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
