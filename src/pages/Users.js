import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';

import Heading from '../components/heading';
import UsersSubheading from '../components/manageUsers/UsersSubheading';
import UsersTable from '../components/manageUsers/UsersTable';
import { TabsContext } from '../contexts/tabsContext';
import Roles from '../views/settings/ManageUsers/Roles';
import Groups from '../views/settings/ManageUsers/Groups';
import { paginationDefault } from '../utils/constants';

export default function Users() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('1');

  const { activatedTab, setActivatedTab } = useContext(TabsContext);
  const [rolesPaginationPage, setRolesPaginationPage] =
    useState(paginationDefault);
  const [usersPaginationPage, setUsersPaginationPage] =
    useState(paginationDefault);

  useEffect(() => {
    if (activatedTab[location.pathname]) {
      setActiveTab(activatedTab[location.pathname]);
    }
  }, []);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setRolesPaginationPage({ page: 1, limit: 10 });
      setUsersPaginationPage(paginationDefault);

      setActivatedTab({
        [location.pathname]: tab,
      });
    }
  };

  return (
    <>
      <Heading title="Manage Users" useBc showGreeting={false}>
        <UsersSubheading activeTab={activeTab} toggle={toggle} />
      </Heading>

      <TabContent activeTab={activeTab}>
        <TabPane tabId={'1'}>
          <UsersTable
            paginationPage={usersPaginationPage}
            setPaginationPage={setUsersPaginationPage}
          />
        </TabPane>
        <TabPane tabId={'2'}>
          <Roles paginationPage={rolesPaginationPage} />
        </TabPane>
        <TabPane tabId={'3'}>
          <Groups />
        </TabPane>
      </TabContent>
    </>
  );
}
