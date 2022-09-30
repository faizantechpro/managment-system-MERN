import {
  Column,
  DataType,
  Default,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { defaultModelOptions, ModelTimestamp } from '../types';

export type TenantColor = {
  name: string;
  primaryColor: string;
  secondaryColor: string;
};

export type TenantAttrs = {
  /**
   * @format uuid
   */
  id: string;
  name: string;
  type: string;
  domain: string;
  modules: string;
  colors: TenantColor;
  logo: string;
  icon?: string;
  use_logo?: boolean;
  settings: any; // TODO define type
};

export type TenantAttr = TenantAttrs & ModelTimestamp;

@Table({
  ...defaultModelOptions,
  tableName: 'tenants',
})
export class TenantDB extends Model<TenantAttr> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: TenantAttr['id'];

  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: TenantAttr['name'];

  @AllowNull(false)
  @Column(DataType.STRING(100))
  type!: TenantAttr['type'];

  @AllowNull(false)
  @Column(DataType.STRING(100))
  domain!: TenantAttr['domain'];

  @AllowNull(false)
  @Column(DataType.TEXT)
  modules!: TenantAttr['modules'];

  @AllowNull(false)
  @Column(DataType.JSON)
  colors!: TenantAttr['colors'];

  @AllowNull(false)
  @Column(DataType.TEXT)
  logo!: TenantAttr['logo'];

  @AllowNull(true)
  @Column(DataType.TEXT)
  icon!: TenantAttr['icon'];

  @Column(DataType.BOOLEAN)
  use_logo!: TenantAttr['use_logo'];

  @AllowNull(false)
  @Column(DataType.JSON)
  settings!: TenantAttr['settings'];
}
