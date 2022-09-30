import { Express } from 'express';
import CubejsServerCore from '@cubejs-backend/server-core';
import PostgresDriver from '@cubejs-backend/postgres-driver';
import { CustomFileRepository } from './CustomFileRepository';
import { AuthUser } from '../auth';
import { Context } from 'lib/biz/utils';
import { DB } from '../sequelize';
import { createServiceMiddleware } from '../context';

export function initCubejs(
  app: Express,
  config: {
    apiSecret?: string;
    db: {
      host?: string;
      database?: string;
      username?: string;
      password?: string;
    };
  }
) {
  const cubejsServer = CubejsServerCore.create({
    /**
     * See this issue: https://github.com/cube-js/cube.js/issues/335
     * Until CubeJS provides an official way to disable base path route usage,
     * we have to maintain our own forked repo to allow that option...
     *
     * Delete this option until above issue is resolved
     */
    disableBasePath: true,

    telemetry: false,
    dbType: 'postgres',
    apiSecret: config.apiSecret || '',
    basePath: '/api/analytics',
    // See class for explanation on class. Luckily repositoryFactory allows us to override
    // how cubejs imports files because they don't do it the TS way...
    repositoryFactory: () => new CustomFileRepository(),
    driverFactory: () =>
      new PostgresDriver({
        host: config.db.host || 'localhost',
        database: config.db.database || 'idf',
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        // this any is required until cubejs officially supports a way to disable base path
      }) as any,

    checkAuth: (req, auth) => {},
    queryRewrite: async (query, { securityContext }) => {
      const services = createServiceMiddleware(securityContext);
      const user = securityContext.user as AuthUser;
      const db = securityContext.db as DB['models'];
      const ctx = new Context({ db, user, services });

      if (!query.filters) {
        query.filters = [];
      }
      if (!query.dimensions) {
        query.dimensions = [];
      }
      query.filters = query.filters?.filter((filter) => {
        return filter.member !== 'Tenant.id';
      });

      const isRequestingDimension = (search: string) =>
        query.dimensions!.some((dimension) =>
          dimension.toLowerCase().startsWith(`${search.toLowerCase()}.`)
        );

      const hasDeals = isRequestingDimension('Deal');
      const hasLessonProgress = isRequestingDimension('LessonProgress');
      const hasUsers = isRequestingDimension('User');

      let ctxQuery;
      const orItems = [];
      if (hasDeals) {
        ctxQuery = {
          ...(await ctx.userDealQuery.build()),
        };

        if (ctxQuery.ownedIds && ctxQuery.ownedIds.length > 0) {
          orItems.push({
            member: 'Deal.id',
            operator: 'equals',
            values: ctxQuery.ownedIds,
          });
        }
        if (ctxQuery.userId) {
          orItems.push({
            member: 'Deal.createdById',
            operator: 'equals',
            values: ctxQuery.userId,
          });
          orItems.push({
            member: 'Deal.assignedUserId',
            operator: 'equals',
            values: ctxQuery.userId,
          });
        }
      } else {
        ctxQuery = {
          ...(await ctx.userQuery.build()),
        };
      }

      const hasSelf = query.filters.some(
        (item) => item.values && item.values[0] === 'self'
      );
      if (hasSelf) {
        query.filters.forEach((item) => {
          if (item.values && item.values[0] === 'self') {
            item.values = [user.id];
          }
        });
      }

      if (ctxQuery.userId) {
        if (hasLessonProgress) {
          orItems.push({
            member: 'LessonProgress.userId',
            operator: 'equals',
            values: [ctxQuery.userId],
          });
        }
        if (hasUsers) {
          orItems.push({
            member: 'User.id',
            operator: 'equals',
            values: [ctxQuery.userId],
          });
        }
      }
      if (ctxQuery.tenantId) {
        query.filters.push({
          member: 'Tenant.id',
          operator: 'equals',
          values: [ctxQuery.tenantId],
        });
      }

      if (orItems.length > 0) {
        query.filters.push({
          or: orItems,
        } as any);
      }

      return query;
    },
  });

  cubejsServer.initApp(app);
}
