import { NextFunction, Request, Response } from 'express';
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
  feedResourceBizFactory,
  GroupBiz,
  InsightBiz,
  LabelBiz,
  LessonBiz,
  NaicsBiz,
  ownerBizFactory,
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
  feedResourceDAOFactory,
  GroupDAO,
  LabelDAO,
  LessonDAO,
  LessonProgressDAO,
  NaicsDAO,
  OrganizationDAO,
  ownerDAOFactory,
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
  activityServiceFactory,
  contactServiceFactory,
  dealServiceFactory,
  feedCommentServiceFactory,
  feedFileServiceFactory,
  feedLogServiceFactory,
  feedServiceFactory,
  FilesService,
  organizationGuestServiceFactory,
  organizationServiceFactory,
  reportInsightServiceFactory,
  reportServiceFactory,
  rpmgServiceFactory,
  userCredentialFactory,
  userServiceFactory,
} from 'lib/services';
import { DB } from '../sequelize';
import { ContextServices } from './types';

export type ContextMiddleware = { services: ContextServices };

export function servicesMiddleware(
  req: Request & ContextMiddleware,
  res: Response,
  next: NextFunction
) {
  req.services = createServiceMiddleware(req);

  return next();
}

export function createServiceMiddleware(req: Request & ContextMiddleware) {
  const services: ContextServices = {
    biz: {
      activity: {} as any,
      analytic: {} as any,
      badge: {} as any,
      category: {} as any,
      component: {} as any,
      contact: {} as any,
      contactFeed: {} as any,
      contactOwner: {} as any,
      course: {} as any,
      dashboard: {} as any,
      deal: {} as any,
      dealFeed: {} as any,
      dealOwner: {} as any,
      dealProduct: {} as any,
      dealStage: {} as any,
      group: {} as any,
      insight: {} as any,
      label: {} as any,
      lesson: {} as any,
      naics: {} as any,
      organizationFeed: {} as any,
      organizationOwner: {} as any,
      product: {} as any,
      role: {} as any,
      team: {} as any,
      teamMember: {} as any,
      tenant: {} as any,
      tenantIntegration: {} as any,
      user: {} as any,
      userAuthorization: {} as any,
    },
    dao: {
      activity: {} as any,
      analytic: {} as any,
      badge: {} as any,
      category: {} as any,
      component: {} as any,
      contact: {} as any,
      course: {} as any,
      courseProgress: {} as any,
      contactFeed: {} as any,
      contactOwner: {} as any,
      dashboard: {} as any,
      dashboardComponent: {} as any,
      deal: {} as any,
      dealFeed: {} as any,
      dealOwner: {} as any,
      dealProduct: {} as any,
      dealStage: {} as any,
      group: {} as any,
      label: {} as any,
      lesson: {} as any,
      lessonProgress: {} as any,
      naics: {} as any,
      organization: {} as any,
      organizationFeed: {} as any,
      organizationOwner: {} as any,
      permission: {} as any,
      product: {} as any,
      role: {} as any,
      sp: {} as any,
      team: {} as any,
      teamMember: {} as any,
      tenant: {} as any,
      tenantDealStage: {} as any,
      tenantIntegration: {} as any,
      user: {} as any,
      userAuthorization: {} as any,
      userCredential: {} as any,
    },
    data: {
      activity: {} as any,
      contact: {} as any,
      deal: {} as any,
      feed: {} as any,
      feedComment: {} as any,
      feedFile: {} as any,
      feedLog: {} as any,
      file: {} as any,
      report: {} as any,
      reportInsight: {} as any,
      rpmg: {} as any,
      organization: {} as any,
      organizationGuest: organizationGuestServiceFactory({} as any),
      user: {} as any,
      userCredential: {} as any,
    },
  };

  if (req.user) {
    const db = (req as any).db as DB['models'];
    const bizOpts = {
      db,
      user: req.user,
      exception: (req as any).exception,
      services: services, // post assignment through reference
    };

    services.dao.activity = new ActivityDAO(db.ActivityDB, bizOpts);
    services.dao.analytic = new AnalyticDAO(db.AnalyticDB, bizOpts);
    services.dao.badge = new BadgeDAO(db.BadgeDB, bizOpts);
    services.dao.category = new CategoryDAO(db.CategoryDB, bizOpts);
    services.dao.component = new ComponentDAO(db.ComponentDB, bizOpts);
    services.dao.contact = new ContactDAO(db.ContactDB, bizOpts);
    services.dao.course = new CourseDAO(db.CourseDB, bizOpts);
    services.dao.courseProgress = new CourseProgressDAO(
      db.CourseProgressDB,
      bizOpts
    );
    services.dao.dashboard = new DashboardDAO(db.DashboardDB, bizOpts);
    services.dao.dashboardComponent = new DashboardComponentDAO(
      db.DashboardComponentDB,
      bizOpts
    );
    services.dao.deal = new DealDAO(db.DealDB, bizOpts);
    services.dao.dealProduct = new DealProductDAO(db.DealProductDB, bizOpts);
    services.dao.dealStage = new DealStageDAO(db.DealStageDB, bizOpts);
    services.dao.group = new GroupDAO(db.GroupDB, bizOpts);
    services.dao.label = new LabelDAO(db.LabelDB, bizOpts);
    services.dao.lesson = new LessonDAO(db.LessonDB, bizOpts);
    services.dao.lessonProgress = new LessonProgressDAO(
      db.LessonProgressDB,
      bizOpts
    );
    services.dao.naics = new NaicsDAO(db.NaicsDB, bizOpts);
    services.dao.organization = new OrganizationDAO(db.OrganizationDB, bizOpts);
    services.dao.permission = new PermissionDAO(db.PermissionDB, bizOpts);
    services.dao.product = new ProductDAO(db.ProductDB, bizOpts);
    services.dao.role = new RoleDAO(db.RoleDB, bizOpts);
    services.dao.sp = new SpDAO(db.SpSummaryDB, bizOpts);
    services.dao.team = new TeamDAO(db.TeamDB, bizOpts);
    services.dao.teamMember = new TeamMemberDAO(db.TeamMemberDB, bizOpts);
    services.dao.tenant = new TenantDAO(db.TenantDB, bizOpts);
    services.dao.tenantDealStage = new TenantDealStageDAO(
      db.TenantDealStageDB,
      bizOpts
    );
    services.dao.tenantIntegration = new TenantIntegrationDAO(
      db.TenantIntegrationDB,
      bizOpts
    );
    services.dao.user = new UserDAO(db.UserDB, bizOpts);
    services.dao.userAuthorization = new UserAuthorizationDAO(
      db.UserAuthorizationDB,
      bizOpts
    );
    services.dao.userCredential = new UserCredentialDAO(
      db.UserCredentialDB,
      bizOpts
    );

    services.dao.contactFeed = feedResourceDAOFactory(
      'contact',
      db.FeedDB,
      bizOpts
    );
    services.dao.dealFeed = feedResourceDAOFactory('deal', db.FeedDB, bizOpts);
    services.dao.organizationFeed = feedResourceDAOFactory(
      'organization',
      db.FeedDB,
      bizOpts
    );

    services.dao.contactOwner = ownerDAOFactory(
      'contact',
      db.ContactOwnerDB,
      bizOpts
    );
    services.dao.dealOwner = ownerDAOFactory('deal', db.DealOwnerDB, bizOpts);
    services.dao.organizationOwner = ownerDAOFactory(
      'organization',
      db.OrganizationOwnerDB,
      bizOpts
    );

    const contactBizOpts = {
      ...bizOpts,
      type: 'contact' as const,
    };
    const dealBizOpts = {
      ...bizOpts,
      type: 'deal' as const,
    };
    const organizationBizOpts = {
      ...bizOpts,
      type: 'organization' as const,
    };

    services.biz.activity = new ActivityBiz(bizOpts);
    services.biz.analytic = new AnalyticBiz(bizOpts);
    services.biz.badge = new BadgeBiz(bizOpts);
    services.biz.category = new CategoryBiz(bizOpts);
    services.biz.component = new ComponentBiz(bizOpts);
    services.biz.contact = new ContactBiz(bizOpts);
    services.biz.course = new CourseBiz(bizOpts);
    services.biz.dashboard = new DashboardBiz(bizOpts);
    services.biz.deal = new DealBiz(bizOpts);
    services.biz.dealProduct = new DealProductBiz(bizOpts);
    services.biz.dealStage = new DealStageBiz(bizOpts);
    services.biz.group = new GroupBiz(bizOpts);
    services.biz.insight = new InsightBiz(bizOpts);
    services.biz.label = new LabelBiz(bizOpts);
    services.biz.lesson = new LessonBiz(bizOpts);
    services.biz.naics = new NaicsBiz(bizOpts);
    services.biz.product = new ProductBiz(bizOpts);
    services.biz.role = new RoleBiz(bizOpts);
    services.biz.team = new TeamBiz(bizOpts);
    services.biz.teamMember = new TeamMemberBiz(bizOpts);
    services.biz.tenant = new TenantBiz(bizOpts);
    services.biz.tenantIntegration = new TenantIntegrationBiz(bizOpts);
    services.biz.user = new UserBiz(bizOpts);
    services.biz.userAuthorization = new UserAuthorizationBiz(bizOpts);

    services.biz.contactFeed = feedResourceBizFactory(
      'contact',
      contactBizOpts
    );
    services.biz.dealFeed = feedResourceBizFactory('deal', dealBizOpts);
    services.biz.organizationFeed = feedResourceBizFactory(
      'organization',
      organizationBizOpts
    );

    services.biz.contactOwner = ownerBizFactory('contact', contactBizOpts);
    services.biz.dealOwner = ownerBizFactory('deal', dealBizOpts);
    services.biz.organizationOwner = ownerBizFactory(
      'organization',
      organizationBizOpts
    );

    services.data.activity = activityServiceFactory(req.user);
    services.data.contact = contactServiceFactory(req.user);
    services.data.deal = dealServiceFactory(req.user);
    services.data.feed = feedServiceFactory(req.user);
    services.data.feedComment = feedCommentServiceFactory(req.user);
    services.data.feedFile = feedFileServiceFactory(req.user);
    services.data.feedLog = feedLogServiceFactory(req.user);
    services.data.file = new FilesService();
    services.data.organization = organizationServiceFactory(req.user);
    services.data.organizationGuest = organizationGuestServiceFactory(req.user);
    services.data.report = reportServiceFactory(req.user);
    services.data.reportInsight = reportInsightServiceFactory(req.user);
    services.data.rpmg = rpmgServiceFactory(req.user);
    services.data.user = userServiceFactory(req.user);
    services.data.userCredential = userCredentialFactory(req.user);
  }

  return services;
}
