import React, { useContext, useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { useLocation } from 'react-router-dom';

import classnames from 'classnames';
import Heading from '../components/heading';
import { TabsContext } from '../contexts/tabsContext';
import ProspectSearch from './Prospects-rocket';
import News from './News';

const Resrcs = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(1);

  const { activatedTab, setActivatedTab } = useContext(TabsContext);

  useEffect(() => {
    if (activatedTab[location.pathname]) {
      setActiveTab(activatedTab[location.pathname]);
    }
  }, []);

  const tabsData = [
    {
      title: 'Prospects',
      component: <ProspectSearch />,
      tabId: 1,
    },
    {
      title: 'News',
      component: <News />,
      tabId: '3',
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
      <Heading title="Resources" useBc showGreeting={false}>
        <Nav tabs>
          {tabsData.map((item) => (
            <NavItem key={item.tabId}>
              <NavLink
                className={classnames({ active: activeTab === item.tabId })}
                onClick={() => {
                  toggle(item.tabId);
                }}
              >
                <span className="font-weight-semi-bold">{item.title}</span>
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

export default Resrcs;
