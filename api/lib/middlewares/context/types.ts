import {
  ActivityBiz,
  AnalyticBiz,
  BadgeBiz,
  CategoryBiz,
  ComponentBiz,
  ContactBiz,
  CourseBiz,
  DashboardBiz,
  DealBiz,
  DealProductBiz,
  DealStageBiz,
  FeedResourceBizFactory,
  GroupBiz,
  InsightBiz,
  LabelBiz,
  LessonBiz,
  NaicsBiz,
  OwnerBizFactory,
  ProductBiz,
  RoleBiz,
  TeamBiz,
  TeamMemberBiz,
  TenantBiz,
  TenantIntegrationBiz,
  UserAuthorizationBiz,
  UserBiz,
} from 'lib/biz';
import {
  ActivityDAO,
  AnalyticDAO,
  BadgeDAO,
  CategoryDAO,
  ComponentDAO,
  ContactDAO,
  CourseDAO,
  CourseProgressDAO,
  DashboardComponentDAO,
  DashboardDAO,
  DealDAO,
  DealProductDAO,
  DealStageDAO,
  FeedResourceDAOFactory,
  GroupDAO,
  LabelDAO,
  LessonDAO,
  LessonProgressDAO,
  NaicsDAO,
  OrganizationDAO,
  OwnerDAOFactory,
  PermissionDAO,
  ProductDAO,
  RoleDAO,
  SpDAO,
  TeamDAO,
  TeamMemberDAO,
  TenantDAO,
  TenantDealStageDAO,
  TenantIntegrationDAO,
  UserAuthorizationDAO,
  UserCredentialDAO,
  UserDAO,
} from 'lib/dao';
import {
  contactServiceFactory,
  dealServiceFactory,
  FilesService,
  organizationGuestServiceFactory,
  organizationServiceFactory,
  reportInsightServiceFactory,
  reportServiceFactory,
  rpmgServiceFactory,
  userServiceFactory,
  userCredentialFactory,
  feedServiceFactory,
  feedLogServiceFactory,
  feedCommentServiceFactory,
  activityServiceFactory,
  feedFileServiceFactory,
} from 'lib/services';

export type ContextServices = {
  biz: {
    activity: ActivityBiz;
    analytic: AnalyticBiz;
    badge: BadgeBiz;
    category: CategoryBiz;
    component: ComponentBiz;
    contact: ContactBiz;
    contactFeed: FeedResourceBizFactory<'contact'>;
    contactOwner: OwnerBizFactory<'contact'>;
    course: CourseBiz;
    dashboard: DashboardBiz;
    deal: DealBiz;
    dealFeed: FeedResourceBizFactory<'deal'>;
    dealOwner: OwnerBizFactory<'deal'>;
    dealProduct: DealProductBiz;
    dealStage: DealStageBiz;
    group: GroupBiz;
    insight: InsightBiz;
    label: LabelBiz;
    lesson: LessonBiz;
    naics: NaicsBiz;
    organizationFeed: FeedResourceBizFactory<'organization'>;
    organizationOwner: OwnerBizFactory<'organization'>;
    product: ProductBiz;
    role: RoleBiz;
    team: TeamBiz;
    teamMember: TeamMemberBiz;
    tenant: TenantBiz;
    tenantIntegration: TenantIntegrationBiz;
    user: UserBiz;
    userAuthorization: UserAuthorizationBiz;
  };
  dao: {
    activity: ActivityDAO;
    analytic: AnalyticDAO;
    badge: BadgeDAO;
    category: CategoryDAO;
    component: ComponentDAO;
    contact: ContactDAO;
    contactFeed: FeedResourceDAOFactory<'contact'>['dao'];
    contactOwner: OwnerDAOFactory<'contact'>['dao'];
    course: CourseDAO;
    courseProgress: CourseProgressDAO;
    dashboard: DashboardDAO;
    dashboardComponent: DashboardComponentDAO;
    deal: DealDAO;
    dealFeed: FeedResourceDAOFactory<'deal'>['dao'];
    dealOwner: OwnerDAOFactory<'deal'>['dao'];
    dealProduct: DealProductDAO;
    dealStage: DealStageDAO;
    group: GroupDAO;
    label: LabelDAO;
    lesson: LessonDAO;
    lessonProgress: LessonProgressDAO;
    naics: NaicsDAO;
    organization: OrganizationDAO;
    organizationFeed: FeedResourceDAOFactory<'organization'>['dao'];
    organizationOwner: OwnerDAOFactory<'organization'>['dao'];
    permission: PermissionDAO;
    product: ProductDAO;
    role: RoleDAO;
    sp: SpDAO;
    team: TeamDAO;
    teamMember: TeamMemberDAO;
    tenant: TenantDAO;
    tenantDealStage: TenantDealStageDAO;
    tenantIntegration: TenantIntegrationDAO;
    user: UserDAO;
    userAuthorization: UserAuthorizationDAO;
    userCredential: UserCredentialDAO;
  };
  data: {
    activity: ReturnType<typeof activityServiceFactory>;
    contact: ReturnType<typeof contactServiceFactory>;
    deal: ReturnType<typeof dealServiceFactory>;
    feed: ReturnType<typeof feedServiceFactory>;
    feedComment: ReturnType<typeof feedCommentServiceFactory>;
    feedFile: ReturnType<typeof feedFileServiceFactory>;
    feedLog: ReturnType<typeof feedLogServiceFactory>;
    file: FilesService;
    organization: ReturnType<typeof organizationServiceFactory>;
    organizationGuest: ReturnType<typeof organizationGuestServiceFactory>;
    report: ReturnType<typeof reportServiceFactory>;
    reportInsight: ReturnType<typeof reportInsightServiceFactory>;
    rpmg: ReturnType<typeof rpmgServiceFactory>;
    user: ReturnType<typeof userServiceFactory>;
    userCredential: ReturnType<typeof userCredentialFactory>;
  };
};
