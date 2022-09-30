import { PickNotUndefined } from 'lib/utils';
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import {
  defaultModelOptions,
  ModelTimestamp,
  ToCreateType,
  ToModifyType,
} from '../types';
import { TenantDB } from './TenantDB';

const tenantIntegrationTypes = ['FISERV'] as const;
export type TenantIntegrationType = typeof tenantIntegrationTypes[number];

export type TenantIntegrationCredential = {
  url: string;
  client_id: string;
  client_secret: string;
};

export type TenantIntegrationAttr = {
  /**
   * @format uuid
   */
  id: string;
  /**
   * @format uuid
   */
  tenant_id: string;
  type: TenantIntegrationType;
  credentials: TenantIntegrationCredential;
  enabled: boolean;
} & ModelTimestamp;

export type TenantIntegrationCreateDAO = ToCreateType<
  TenantIntegrationAttr,
  never,
  'id',
  never
>;
export type TenantIntegrationModifyDAO = ToModifyType<
  TenantIntegrationCreateDAO,
  'type' | 'tenant_id'
>;

@Table({
  ...defaultModelOptions,
  tableName: 'tenant_integration',
})
export class TenantIntegrationDB extends Model<
  TenantIntegrationAttr,
  PickNotUndefined<TenantIntegrationCreateDAO>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: TenantIntegrationAttr['id'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Unique('unique_tenant_id_type')
  @Column(DataType.UUID)
  tenant_id!: TenantIntegrationAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;

  @AllowNull(false)
  @Unique('unique_tenant_id_type')
  @Column(DataType.ENUM(...tenantIntegrationTypes))
  type!: TenantIntegrationAttr['type'];

  @AllowNull(false)
  @Column(DataType.JSONB)
  credentials!: TenantIntegrationAttr['credentials'];

  @Default(false)
  @Column(DataType.BOOLEAN)
  enabled!: TenantIntegrationAttr['enabled'];
}
