import { GenericRepository } from 'lib/dao';
import { Sequelize } from 'sequelize-typescript';
import * as models from './models';

export let sequelize: DB;

export type TableNames = keyof Tables;

type ToAssociation<Model extends {}, T extends {} = {}> = {
  model: Model;
  repo: { associations: T };
};

export type Tables = {
  ActivityDB: ToAssociation<models.ActivityDB>;
  AnalyticDB: ToAssociation<models.AnalyticDB>;
  BadgeDB: ToAssociation<models.BadgeDB>;
  CategoryDB: ToAssociation<models.CategoryDB>;
  ComponentDB: ToAssociation<models.ComponentDB>;
  ContactDB: ToAssociation<models.ContactDB>;
  ContactOwnerDB: ToAssociation<
    models.ContactOwnerDB,
    {
      contact: ToTarget<'ContactDB'>;
      user: ToTarget<'UserDB'>;
    }
  >;
  CourseDB: ToAssociation<
    models.CourseDB,
    {
      progress: ToTarget<'CourseProgressDB'>;
    }
  >;
  CourseLessonDB: ToAssociation<models.CourseLessonDB>;
  CourseProgressDB: ToAssociation<models.CourseProgressDB>;
  DashboardComponentDB: ToAssociation<
    models.DashboardComponentDB,
    {
      dashboard: ToTarget<'DashboardDB'>;
      component: ToTarget<'ComponentDB'>;
    }
  >;
  DashboardDB: ToAssociation<models.DashboardDB>;
  DealDB: ToAssociation<
    models.DealDB,
    {
      organization: ToTarget<'OrganizationDB'>;
    }
  >;
  DealOwnerDB: ToAssociation<
    models.DealOwnerDB,
    {
      deal: ToTarget<'DealDB'>;
      user: ToTarget<'UserDB'>;
    }
  >;
  DealProductDB: ToAssociation<models.DealProductDB>;
  DealStageDB: ToAssociation<models.DealStageDB>;
  FeedDB: ToAssociation<
    models.FeedDB,
    {
      contact: ToTarget<'ContactDB'>;
      deal: ToTarget<'DealDB'>;
      organization: ToTarget<'OrganizationDB'>;
    }
  >;
  GroupDB: ToAssociation<models.GroupDB>;
  LabelDB: ToAssociation<models.LabelDB>;
  LessonDB: ToAssociation<
    models.LessonDB,
    {
      progress: ToTarget<'LessonProgressDB'>;
    }
  >;
  LessonPageDB: ToAssociation<models.LessonPageDB>;
  LessonProgressDB: ToAssociation<models.LessonProgressDB>;
  NaicsCrossReferenceDB: ToAssociation<models.NaicsCrossReferenceDB>;
  NaicsDB: ToAssociation<models.NaicsDB>;
  NaicsSpDB: ToAssociation<models.NaicsSpDB>;
  OrganizationDB: ToAssociation<models.OrganizationDB>;
  OrganizationOwnerDB: ToAssociation<
    models.OrganizationOwnerDB,
    {
      organization: ToTarget<'OrganizationDB'>;
      user: ToTarget<'UserDB'>;
    }
  >;
  PermissionDB: ToAssociation<models.PermissionDB>;
  ProductDB: ToAssociation<models.ProductDB>;
  QuizDB: ToAssociation<models.QuizDB>;
  QuizQuestionDB: ToAssociation<models.QuizQuestionDB>;
  QuizSubmissionDB: ToAssociation<models.QuizSubmissionDB>;
  RoleDB: ToAssociation<models.RoleDB>;
  SpSummaryDB: ToAssociation<
    models.SpSummaryDB,
    {
      naics_sp: ToTarget<'NaicsSpDB'>;
    }
  >;
  TeamDB: ToAssociation<models.TeamDB>;
  TeamMemberDB: ToAssociation<models.TeamMemberDB>;
  TenantDB: ToAssociation<models.TenantDB>;
  TenantDealStageDB: ToAssociation<models.TenantDealStageDB>;
  TenantIntegrationDB: ToAssociation<models.TenantIntegrationDB>;
  UserAuthorizationDB: ToAssociation<models.UserAuthorizationDB>;
  UserCredentialDB: ToAssociation<models.UserCredentialDB>;
  UserDB: ToAssociation<models.UserDB>;
};

export type ToTarget<T extends TableNames> = {
  target: ToGenericRepository<T>;
};

export type ToGenericRepository<T extends TableNames> = {
  [K in T]: GenericRepository<K> & Tables[K]['repo'];
}[T];

export type DB = Sequelize & {
  models: {
    [K in keyof Tables]: ToGenericRepository<K>;
  };
};

export async function sequelizeInit(opts: {
  host: string;
  port: number;
  database: string;
  schema?: string;
  username: string;
  password: string;
  sync: boolean;
}) {
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: opts.host,
    port: opts.port,
    database: opts.database,
    dialectOptions: {
      schema: opts.schema,
    },
    username: opts.username,
    password: opts.password,
    models: [__dirname + '/models/**/*DB.{ts,js}'],
  }) as DB;

  if (opts.sync) {
    await sequelize.sync();
  }
  return sequelize;
}
