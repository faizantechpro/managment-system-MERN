import {
  BuildOptions,
  BulkCreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  Identifier,
  Model,
  ModelStatic,
  UpsertOptions,
  UpdateOptions,
} from 'sequelize';

export type ExcludeKey<T, U extends string> = Exclude<
  {
    [K in keyof T]: K extends U ? never : K;
  }[keyof T],
  null | undefined
>;

export type ModelTimestamps = {
  created_at: Date;
  updated_at: Date;
};

/**
 * Expands the sequelize type model to include dataValues as well. As the
 * responsibility of tracking dates should be pushed onto the database, add those
 * onto the model as services will not be setting those values.
 *
 * Warning: Do not consider this always be type safe in case query does not select
 * all fields!
 */
export type ExpandModel<T extends Model> = Omit<T, 'toJSON'> &
  T['_attributes'] & {
    // todo migrate away from data values
    dataValues: T extends ModelTimestamps
      ? T['_attributes'] & {
          created_at: T['created_at'];
          updated_at: T['updated_at'];
        }
      : T['_attributes'];
  } & {
    toJSON(): T extends ModelTimestamps
      ? T['_attributes'] & {
          created_at: T['created_at'];
          updated_at: T['updated_at'];
        }
      : T['_attributes'];
  };

/**
 * The default options used by our tables.
 */
export const defaultModelOptions = {
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

/**
 * Creates the static sequlize model
 */
export type StaticModel<T extends Model, U = T['_attributes']> = Pick<
  typeof Model,
  ExcludeKey<
    typeof Model,
    | 'create'
    | 'update'
    | 'bulkCreate'
    | 'destroy'
    | 'findAll'
    | 'findAndCountAll'
    | 'findByPk'
    | 'findOne'
    | 'upsert'
  >
> & {
  new (values?: Partial<T>, options?: BuildOptions): ExpandModel<T>;

  create(
    this: ModelStatic<ExpandModel<T>>,
    values?: ExpandModel<T>['_creationAttributes'] | undefined,
    options?:
      | {
          returning: true;
        }
      | undefined
  ): Promise<ExpandModel<T>>;
  update(
    this: ModelStatic<ExpandModel<T>>,
    values: {
      [key in keyof ExpandModel<T>['_attributes']]?:
        | ExpandModel<T>['_attributes'][key];
    },
    options: UpdateOptions<ExpandModel<T>['_attributes']>
  ): Promise<[number, ExpandModel<T>[]]>;
  bulkCreate(
    this: ModelStatic<ExpandModel<T>>,
    records: ExpandModel<T>['_creationAttributes'][],
    options?: BulkCreateOptions<ExpandModel<T>['_attributes']>
  ): Promise<ExpandModel<T>[]>;
  findAll(
    this: ModelStatic<ExpandModel<T>>,
    options?: FindOptions<U> | undefined
  ): Promise<ExpandModel<T>[]>;
  findAndCountAll(
    this: ModelStatic<ExpandModel<T>>,
    options?: FindAndCountOptions<U> | undefined
  ): Promise<{
    rows: ExpandModel<T>[];
    count: number;
  }>;
  findByPk(
    this: ModelStatic<ExpandModel<T>>,
    identifier?: Identifier,
    options?: Omit<FindOptions<U>, 'where'>
  ): Promise<ExpandModel<T> | null>;
  findOne(
    this: ModelStatic<ExpandModel<T>>,
    options?: FindOptions<U> | undefined
  ): Promise<ExpandModel<T> | null>;
  upsert(
    this: ModelStatic<ExpandModel<T>>,
    values: any,
    options?: UpsertOptions<U> | undefined
  ): Promise<[ExpandModel<T>, boolean | null]>;
  destroy(
    this: ModelStatic<ExpandModel<T>>,
    options?: DestroyOptions<U> | undefined
  ): Promise<number>;
};

export type toJSON<T extends Model> = ReturnType<ExpandModel<T>['toJSON']>;
