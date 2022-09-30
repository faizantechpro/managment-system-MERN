import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import {
  camelModelOptions,
  Timestamp,
  ToCreateType,
  ToModifyType,
} from '../types';
import { TenantDB } from './TenantDB';
import { UserDB } from './UserDB';
import { PickNotUndefined } from 'lib/utils';

export const analyticDisplayTypes = [
  'kpi_standard',
  'kpi_scorecard',
  'kpi_growth_index',
  'kpi_rankings',
  'kpi_basic',
  'chart_column',
  'chart_donut',
  'chart_pie',
  'chart_bar',
  'chart_line',
  'chart_table',
  'chart_funnel',
  'chart_area',
  'chart_heat',
] as const;
export type AnalyticDisplayType = typeof analyticDisplayTypes[number];

export const analyticTypes = [
  'Contact',
  'Course',
  'CourseProgress',
  'Deal',
  'Lesson',
  'LessonProgress',
  'Organization',
] as const;
export type AnalyticType = typeof analyticTypes[number];

export type AnalyticGranularity = 'day' | 'week' | 'month' | 'year';
export type AnalyticRelativeTimeRange =
  | `this ${Exclude<AnalyticGranularity, 'day'>}`
  | 'today'
  | 'yesterday'
  | `last ${Exclude<AnalyticGranularity, 'day'>}`
  | `last ${number} ${AnalyticGranularity}`
  | `from ${number} ${AnalyticGranularity} ago to now`;

export type AnalyticFilterOperator =
  | 'set' // is not null, no value required
  | 'notSet' // is null, no value required
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte';

export type AnalyticFilter<T extends AnalyticFilterOperator> =
  T extends Exclude<AnalyticFilterOperator, 'set' | 'notSet'>
    ? {
        member: string;
        operator: T;
        values: string[];
      }
    : {
        member: string;
        operator: T;
      };
export type AnalyticOrder = [string, 'asc' | 'desc'][];
export type AnalyticDateRange = [string, string] | AnalyticRelativeTimeRange;
export type AnalyticTimeDimension =
  | []
  | [
      {
        // custom time range or relative time range
        dateRange: AnalyticDateRange;
        dimension: string;
        granularity?: AnalyticGranularity;
      }
    ]
  | [
      {
        compareDateRange: [AnalyticDateRange, AnalyticDateRange];
        dimension: string;
        granularity?: AnalyticGranularity;
      }
    ];

export type AnalyticAttr = {
  /**
   * @format uuid
   */
  id: string;
  name: string;
  type: AnalyticType;
  relatedTypes: AnalyticType[];
  displayType: AnalyticDisplayType;
  icon: string;

  // both can be null which indicates public analytic
  /**
   * @format uuid
   */
  createdById: string;
  /**
   * @format uuid
   */
  tenantId: string;

  // cubejs analytic query

  isMulti: boolean; // default is false
  dimensions: Array<string>; // default is []
  filters: AnalyticFilter<AnalyticFilterOperator>[]; // default is []
  limit: number; // default is 10000
  measures: string[]; // default is []
  order: AnalyticOrder; // default is []
  segments: string[]; // default is []
  timeDimensions: AnalyticTimeDimension; // default is []
} & Timestamp;

type AnalyticQueryKeys =
  | 'isMulti'
  | 'dimensions'
  | 'filters'
  | 'limit'
  | 'measures'
  | 'order'
  | 'segments'
  | 'timeDimensions';
// This one is a bit tricky as the values are defaults, we must make the default
// values as Partial as it might be provided by user but if not, db will set value
export type AnalyticCreateDAO = ToCreateType<
  AnalyticAttr,
  never,
  'id',
  AnalyticQueryKeys
>;
export type AnalyticModifyDAO = ToModifyType<
  AnalyticCreateDAO,
  'tenantId' | 'createdById'
>;

export type AnalyticCreateBiz = Omit<
  AnalyticCreateDAO,
  'createdById' | 'tenantId'
>;
export type AnalyticModifyBiz = Partial<AnalyticCreateBiz>;

@Table({
  ...camelModelOptions,
  tableName: 'analytic',
})
export class AnalyticDB extends Model<
  AnalyticAttr,
  PickNotUndefined<AnalyticCreateDAO>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: AnalyticAttr['id'];

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  name!: AnalyticAttr['name'];

  @AllowNull(false)
  @Column(DataType.ENUM(...analyticTypes))
  type!: AnalyticAttr['type'];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  relatedTypes!: AnalyticAttr['relatedTypes'];

  @AllowNull(false)
  @Column(DataType.ENUM(...analyticDisplayTypes))
  displayType!: AnalyticAttr['displayType'];

  @AllowNull(false)
  @Column(DataType.STRING)
  icon!: AnalyticAttr['icon'];

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isMulti!: AnalyticAttr['isMulti'];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  dimensions!: AnalyticAttr['dimensions'];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  filters!: AnalyticAttr['filters'];

  @AllowNull(false)
  @Default(10000)
  @Column(DataType.INTEGER)
  limit!: AnalyticAttr['limit'];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  measures!: AnalyticAttr['measures'];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  order!: AnalyticAttr['order'];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  segments!: AnalyticAttr['segments'];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  timeDimensions!: AnalyticAttr['timeDimensions'];

  @ForeignKey(() => UserDB)
  @Column(DataType.UUID)
  createdById!: AnalyticAttr['createdById'];
  @BelongsTo(() => UserDB, 'createdById')
  createdBy!: UserDB;

  @ForeignKey(() => TenantDB)
  @Column(DataType.UUID)
  tenantId!: AnalyticAttr['tenantId'];
  @BelongsTo(() => TenantDB, 'tenantId')
  tenant!: TenantDB;
}
