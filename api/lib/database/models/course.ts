import { CourseAttrs } from 'lib/middlewares/sequelize/models';
import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { StaticModel, defaultModelOptions } from '../helpers';

export type CourseAttributes = CourseAttrs;

export type CourseModifyAttributes = Optional<CourseAttributes, 'id'>;
export type CourseModel = Model<CourseAttributes, CourseModifyAttributes>;

type CourseStaticModel = StaticModel<CourseModel>;

export function CourseRepository(sqlz: Sequelize) {
  return sqlz.define(
    'courses',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.STRING,
      is_learning_path: DataTypes.BOOLEAN,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      quiz_id: {
        type: DataTypes.UUID,
        references: {
          model: 'quizzes',
          key: 'id',
        },
      },
      badge_id: {
        type: DataTypes.UUID,
        references: {
          model: 'badges',
          key: 'id',
        },
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
      isPublic: {
        type: DataTypes.BOOLEAN,
        field: 'isPublic',
      },
    },
    {
      tableName: 'courses',
      ...defaultModelOptions,
    }
  ) as CourseStaticModel;
}
