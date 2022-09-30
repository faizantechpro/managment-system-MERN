import React, { useContext, useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { useHistory } from 'react-router';
import classnames from 'classnames';
import Heading from '../components/heading';
import Peoples from '../views/Deals/contacts/Peoples';
import Organizations from '../views/Deals/contacts/Organizations';
import { TabsContext } from '../contexts/tabsContext';

const TabTitle = ({ icon, title }) => (
  <div className="d-flex align-items-center tab-title">
    <span className="material-icons-outlined m-1 ">{icon}</span>
    <span>{title}</span>
  </div>
);

const Contacts = () => {
  const [activeTab, setActiveTab] = useState(1);
  const history = useHistory();
  const { activatedTab, setActivatedTab } = useContext(TabsContext);

  useEffect(() => {
    if (activatedTab[location.pathname]) {
      setActiveTab(activatedTab[location.pathname]);
    }
    const tab = new URLSearchParams(history.location.search).get('tab');
    if (tab === 'people') {
      setActiveTab(2);
    }
  }, []);

  const tabsData = [
    {
      title: <TabTitle icon="corporate_fare" title="Organizations" />,
      component: <Organizations />,
      tabId: 1,
    },
    {
      title: <TabTitle icon="people" title="People" />,
      component: <Peoples />,
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
      <Heading
        title="Contacts"
        pageHeaderDivider="mb-0"
        useBc={true}
        showGreeting
      >
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

export default Contacts;
