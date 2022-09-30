import { LessonAttrs } from 'lib/middlewares/sequelize/models';
import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { StaticModel, defaultModelOptions } from '../helpers';
import { LessonPageModel } from './lesson-page';

export type LessonAttributes = LessonAttrs & {
  // TEMPORARY, will remove after migrating to sequelize-typescript
  pages?: LessonPageModel[];
};

export type LessonModifyAttributes = Optional<LessonAttributes, 'id'>;
export type LessonModel = Model<LessonAttributes, LessonModifyAttributes>;

type LessonStaticModel = StaticModel<LessonModel>;

export function LessonRepository(sqlz: Sequelize) {
  return sqlz.define(
    'lessons',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: DataTypes.TEXT,
      category_id: DataTypes.INTEGER,
      max_points: DataTypes.INTEGER,
      max_attempts: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
      documents: DataTypes.STRING,
      tags: DataTypes.STRING,
      icon: DataTypes.STRING,
      status: DataTypes.STRING,
      tenant_id: { type: DataTypes.UUID, allowNull: false },
      isPublic: {
        type: DataTypes.BOOLEAN,
        field: 'isPublic',
      },
    },
    {
      tableName: 'lessons',
      ...defaultModelOptions,
    }
  ) as LessonStaticModel;
}
