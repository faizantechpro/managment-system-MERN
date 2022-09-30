import { useState, useEffect, useContext } from 'react';
import { TabContent, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import Heading from '../../heading';
import { TabsContext } from '../../../contexts/tabsContext';
import LookupPeople from './LookupPeople';
import LookupOrganizations from './LookupOrganizations';

const TabTitle = ({ icon, title }) => (
  <div className="d-flex align-items-center justify-content-center tab-title">
    <span className="material-icons-outlined m-1 ">{icon}</span>
    <span>{title}</span>
  </div>
);

const tabsData = [
  {
    title: <TabTitle icon="people" title="People" />,
    component: <LookupPeople />,
    tabId: 1,
  },
  {
    title: <TabTitle icon="corporate_fare" title="Organizations" />,
    component: <LookupOrganizations />,
    tabId: 2,
  },
];

const ProspectLookupTabs = ({ profileInfo }) => {
  const [activeTab, setActiveTab] = useState(1);
  const { setActivatedTab } = useContext(TabsContext);

  useEffect(() => {
    // always open People tab by default
    setActiveTab(1);
  }, []);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);

      setActivatedTab({
        [location.pathname]: tab,
      });
    }
  };

  return (
    <div>
      <Heading title="Contacts" useBc showGreeting={false} paddingBottomDefault>
        <Nav tabs fill>
          {tabsData.map((item) => (
            <NavItem key={item.tabId} className="w-50">
              <NavLink
                className={`py-2 ${classnames({
                  active: activeTab === item.tabId,
                })}`}
                onClick={() => {
                  toggle(item.tabId);
                }}
              >
                {item.title}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Heading>
      <TabContent className="mx-4">
        {activeTab === 1 ? <LookupPeople profileInfo={profileInfo} /> : ''}
        {activeTab === 2 ? (
          <LookupOrganizations profileInfo={profileInfo} />
        ) : (
          ''
        )}
      </TabContent>
    </div>
  );
};

export default ProspectLookupTabs;
