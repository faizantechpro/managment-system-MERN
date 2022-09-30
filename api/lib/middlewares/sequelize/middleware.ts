import { Express, NextFunction, Request, Response } from 'express';
import { DB, sequelize } from './plugin';

export type SequelizeMiddleware = {
  db: DB['models'];
};

export function sequelizeMiddleware(app: Express) {
  app.use(sequelizeMW as any);
}

export function sequelizeMW(
  req: Request & SequelizeMiddleware,
  res: Response,
  next: NextFunction
) {
  req.db = sequelize.models;

  return next();
}
