import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { StaticModel } from '../helpers';

export type FileAttributes = {
  id: string;
  storage: string;
  filename_disk?: string;
  filename_download: string;
  title?: string;
  type?: string;
  folder?: string;
  uploaded_by?: string;
  uploaded_on?: Date;
  modified_by?: string;
  modified_on?: Date;
  charset?: string;
  filesize?: number;
  width?: number;
  height?: number;
  duration?: number;
  embed?: string;
  description?: string;
  location?: string;
  tags?: string;
  metadata?: any;
  tenant_id?: string;
  is_public?: boolean;
};

export type FileCreateAttributes = Optional<FileAttributes, 'id'>;

export type FileModel = Model<FileAttributes, FileCreateAttributes>;

type FileStatic = StaticModel<FileModel>;

export function FileRepository(sqlz: Sequelize) {
  return sqlz.define(
    'files',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      storage: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      filename_disk: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      filename_download: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      folder: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      uploaded_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      uploaded_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      modified_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      modified_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      charset: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      filesize: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      embed: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tags: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
      is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'files',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'file_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  ) as FileStatic;
}
