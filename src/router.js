import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useContext } from 'react';
import Overview from './views/Overview/View';
import MyLessons from './views/Resources/MyLessons';
import Category from './views/Resources/category/Category';
import Lesson from './views/Resources/Lesson';
import CourseBoard from './views/Resources/courses/CourseBoard';
import Login from './pages/Login';
import Reset from './pages/Reset';
import Request from './pages/Request';
import SignUp from './pages/SignUp';
import PrivateRoute from './routes/private';
import Profile from './pages/Profile';
import Deals from './pages/Deals';
import PipelineDetail from './pages/PipelineDetail';
import Reports from './pages/Reports';
import Settings from './views/settings/Settings';
import ResendInvite from './views/settings/Resources/ResendInvite';
import CaseStudy from './views/Resources/casestudies/CaseStudy';
import CaseStudyVideo from './views/Resources/casestudies/CaseStudyVideo';
import Security from './pages/Security';
import Notification from './pages/Notification';
import SiteSettings from './pages/SiteSettings';
import Users from './pages/Users';
import Resources from './pages/Resources';
import Products from './pages/Products';
import Roles from './pages/Roles';
import PeopleProfile from './pages/PeopleProfile';
import PublicProfile from './pages/PublicProfile';
import Contacts from './pages/Contacts';
import OrganizationProfile from './pages/OrganizationProfile';
import routes from './utils/routes.json';
import LearningPath from './pages/LearningPath';
import Questionary from './pages/Questionary';
import Accounts from './pages/Accounts';
// import ProspectsRocket from './pages/Prospects-rocket';
import Resrcs from './pages/Resrcs';
import CompanyDetail from './components/prospecting/v2/Profile/CompanyDetail';
import UserProfile from './views/settings/ManageUsers/Profile';
import Groups from './pages/Groups';
import ProfilePublicPage from './pages/ProfilePublicPage';
import Unauthorized from './views/Errors/403';
// import PublicProfileSignin from './components/publicProfilePage/PublicProfileSignin';
import PeopleDetail from './components/prospecting/v2/Profile/PeopleDetail';
import BulkImportPage from './pages/BulkImport';
import BulkImport from './components/BulkImport';
import Integrations from './pages/Integrations';
import { TenantContext } from './contexts/TenantContext';
import { isModuleAllowed } from './utils/Utils';
export const AppRouter = () => {
  const { tenant } = useContext(TenantContext);
  const getRootComponent = (tenant) => {
    let moduleis = Overview;
    if (isModuleAllowed(tenant.modules, 'Dashboard')) {
      moduleis = Overview;
      return moduleis;
    }

    const arrayOfModules = tenant.modules.split(',');
    for (
      let moduleCount = 0;
      moduleCount < arrayOfModules.length;
      moduleCount++
    ) {
      const module = arrayOfModules[moduleCount];
      let moduleFound;
      switch (module) {
        case 'Contacts':
          moduleFound = Contacts;
          break;
        case 'Deals':
          moduleFound = Deals;
          break;
        case 'Resources':
          moduleFound = Resrcs;
          break;
        case 'Reports':
          moduleFound = Reports;
          break;
        case 'Training':
          moduleFound = LearningPath;
          break;
        default:
          moduleFound = Overview;
      }
      if (moduleFound) {
        moduleis = moduleFound;
        break;
      }
    }

    return moduleis;
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/sign-up" component={SignUp} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/request-password" component={Request} />
        <Route exact path="/reset-password" component={Reset} />
        <Route
          exact
          path="/public/organizations/profile/sign-in"
          component={PublicProfile}
        />
        <Route
          exact
          path="/public/organizations/profile"
          component={ProfilePublicPage}
        />

        <PrivateRoute exact path={routes.accounts} component={Accounts} />

        <PrivateRoute exact path={routes.pipeline} component={Deals} />
        <PrivateRoute
          exact
          path={`${routes.pipeline}/:id/activity/:activityId`}
          component={PipelineDetail}
        />
        <PrivateRoute
          exact
          path={`${routes.pipeline}/:id`}
          component={PipelineDetail}
        />

        <PrivateRoute exact path={routes.contacts} component={Contacts} />
        <Route path="/public-profile" component={PublicProfile} />
        <PrivateRoute
          isSplitView={true}
          path={`${routes.contacts}/:contactId/profile/activity/:activityId`}
          component={PeopleProfile}
        />
        <PrivateRoute
          isSplitView={true}
          path={`${routes.contacts}/:contactId/profile`}
          component={PeopleProfile}
        />

        <PrivateRoute
          isSplitView={true}
          path={`${routes.contacts}/:organizationId/organization/profile/activity/:activityId`}
          component={OrganizationProfile}
        />
        <PrivateRoute
          isSplitView={true}
          path={`${routes.contacts}/:organizationId/organization/profile`}
          component={OrganizationProfile}
        />

        <PrivateRoute path={'/reports'} component={Reports} />

        <PrivateRoute path={routes.favorites} component={MyLessons} />
        <PrivateRoute path="/training/categories/:slug" component={Category} />
        <PrivateRoute
          path="/training/lessons/:id/page/:page_id"
          component={Lesson}
        />
        <PrivateRoute path={routes.lesson} component={Lesson} />
        <PrivateRoute
          path="/training/courses/:id"
          exact
          component={CourseBoard}
        />
        <PrivateRoute
          path="/training/courses/:courseId/quizzes/:quizId"
          exact
          component={Questionary}
        />
        <PrivateRoute
          path="/training/case-studies/:slug"
          component={CaseStudyVideo}
        />
        <PrivateRoute path="/training/case-studies" component={CaseStudy} />
        <PrivateRoute path="/training/learningPath" component={LearningPath} />

        <PrivateRoute exact path="/settings" component={Settings} />
        <PrivateRoute exact path="/settings/profile" component={Profile} />
        <PrivateRoute path="/settings/security" component={Security} />
        <PrivateRoute path="/settings/notifications" component={Notification} />
        <PrivateRoute path={routes.branding} component={SiteSettings} />
        <PrivateRoute path={routes.integrations} component={Integrations} />
        <PrivateRoute
          path="/settings/bulk-import"
          component={BulkImportPage}
          exact
        />
        <PrivateRoute
          path="/settings/bulk-import/:type"
          component={BulkImport}
          exact
        />
        <PrivateRoute
          requireAdminAccess
          exact
          path={routes.training}
          component={Resources}
        />
        <PrivateRoute
          requireAdminAccess
          exact
          path="/settings/resources/:userId"
          component={ResendInvite}
        />

        <PrivateRoute
          requireAdminAccess
          exact
          path={routes.users}
          component={Users}
        />
        <PrivateRoute
          requireAdminAccess
          exact
          path="/settings/products"
          component={Products}
        />

        <PrivateRoute
          requireAdminAccess
          path={`${routes.roles}/:id`}
          component={Roles}
        />
        <PrivateRoute
          isSplitView={true}
          path={`${routes.contacts}/:organizationId/organization/profile/activity/:activityId`}
          component={OrganizationProfile}
        />

        <PrivateRoute exact path={routes.resources} component={Resrcs} />
        <PrivateRoute
          exact
          path="/prospects/people/:id"
          component={PeopleDetail}
        />
        <PrivateRoute
          exact
          path="/prospects/company/:id"
          component={CompanyDetail}
        />
        <PrivateRoute
          requireAdminAccess
          exact
          path={`${routes.users}/:id`}
          component={ResendInvite}
        />
        <PrivateRoute
          exact
          path={`${routes.usersProfile}/:id`}
          component={UserProfile}
        />
        <PrivateRoute
          requireAdminAccess
          path={`${routes.groups}/:id`}
          component={Groups}
        />

        {/* Errors views */}

        <PrivateRoute
          exact
          path={routes.errors.Unauthorized}
          component={Unauthorized}
        />

        {tenant?.modules && (
          <PrivateRoute path="/" component={getRootComponent(tenant)} />
        )}
      </Switch>
    </Router>
  );
};
