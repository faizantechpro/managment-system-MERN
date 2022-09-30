import React, { useContext, useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import Heading from '../components/heading';
import { TabsContext } from '../contexts/tabsContext';
import OrganizationsAccounts from '../views/Accounts/OrganizationsAccounts';
import PeoplesAccounts from '../views/Accounts/PeoplesAccounts';

const TabTitle = ({ icon, title }) => (
  <div className="d-flex align-items-center tab-title">
    <span className="material-icons-outlined m-1 ">{icon}</span>
    <span>{title}</span>
  </div>
);

const Accounts = () => {
  const [activeTab, setActiveTab] = useState(1);

  const { activatedTab, setActivatedTab } = useContext(TabsContext);

  useEffect(() => {
    if (activatedTab[location.pathname]) {
      setActiveTab(activatedTab[location.pathname]);
    }
  }, []);

  const tabsData = [
    {
      title: <TabTitle icon="corporate_fare" title="Organizations" />,
      component: <OrganizationsAccounts />,
      tabId: 1,
    },
    {
      title: <TabTitle icon="people" title="Contacts" />,
      component: <PeoplesAccounts />,
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
      <Heading title="Accounts" useBc>
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
      </Heading>
      <TabContent>
        <TabPane>
          {tabsData.find((item) => item.tabId === activeTab)?.component}
        </TabPane>
      </TabContent>
    </>
  );
};

export default Accounts;
