# Sequelize

Sequelize is being used to interface with our database which requires model definitions and a few types to be used throughout our API.

## General Info

### Why Sequelize and Sequelize-Typescript?

By using an ORM, we reduce the need to write raw SQL queries which may be error prone when constructing complex queries with boolean operators and/or functions. It also abstracts away the underlying database being used which gives us the flexibility to change database vendors if the need ever arises.

And by leveraging sequelize-typescript, we can create type safe models and functions to ensure we know what is being retrieved and stored into the database.

NPM links:

* [sequelize](https://www.npmjs.com/package/sequelize)
* [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript)

## Development

Please see any of the defined models in [./models](./models/) as an example of how to construct your model.

### Design

Your DB model should contain the related attributes, creation for both Biz and DAO, modify for Biz and DAO, and applicable Queries. This is because Open API schemas are being generated based on the defined types.

Example:

```ts
export type ComponentModifyBiz = {
  name?: string;
};
```

Will be transformed to the following OpenAPI

```json
      "ComponentModifyBiz": {
        "properties": {
          "name": {
            "title": "ComponentModifyBiz.name",
            "type": "string"
          }
        },
        "title": "ComponentModifyBiz",
        "type": "object"
      },
```

This allows us to automatically generate OpenAPI types for input enforcement.

### Relationships

Some things to point out however will be with relationships:

* Belongs To:

```ts
  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenant_id!: MyTableAttr['tenant_id'];
  @BelongsTo(() => TenantDB, 'tenant_id')
  tenant!: TenantDB;
```

* Many to Many:

```ts
  @BelongsToMany(() => DashboardDB, () => DashboardComponentDB, 'dashboardId')
  dashboards!: (DashboardDB & { dashboardComponent: DashboardComponentDB })[];
```

* 1 to Many:

```ts
  @HasMany(() => DashboardComponentDB, 'componentId')
  dashboardComponents!: DashboardComponentDB[];
```

### Boilerplate

1. Create the database model with necessary types

```ts
import { OptionalNullable, PickNullable } from 'lib/utils';
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
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { camelModelOptions, Order, Search, Timestamp } from '../types';
import { TenantDB } from './TenantDB';

export type MyTableAttr = {
  /**
   * @format uuid
   */
  id: string;
  /**
   * @format uuid
   */
  tenantId: string;
  /**
   * @maxLength 50
   */
  name: string | null;
} & Timestamp;

export type MyTableQueryDAO = {
  search?: Search;
  order?: Order;
};
// `id` and timestamps are created by sequelize
// OptionalNullable will make null values as optional
export type MyTableCreateDAO = OptionalNullable<
  Omit<MyTableAttr, 'id' | keyof Timestamp>
>;
// `tenant_id` should not be modified after creation
export type MyTableModifyDAO = Omit<MyTableCreateDAO, 'tenantId'>;

export type MyTableQueryBiz = MyTableQueryDAO;
export type MyTableCreateBiz = {
  /**
   * @maxLength 50
   */
  name: string | null;
};

@Table({
  ...camelModelOptions,
  tableName: 'MyTable',
})
export class MyTableDB extends Model<
  MyTableAttr,
  Optional<
    MyTableAttr,
    'id' | keyof Timestamp | keyof PickNullable<MyTableAttr>
  >
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: MyTableAttr['id'];

  @ForeignKey(() => TenantDB)
  @AllowNull(false)
  @Column(DataType.UUID)
  tenantId!: MyTableAttr['tenantId'];
  @BelongsTo(() => TenantDB, 'tenantId')
  tenant!: TenantDB;

  @Column(DataType.STRING(50))
  name!: MyTableAttr['name'];
}
```

2. Add the new file to [./models/index.ts](./models/index.ts). Keep the file alphabetized for consistency

3. Add the new database to `Tables` type in [./plugin](./plugin.ts). Keep the file alphabetized for consistency.

```ts
export type Tables = {
  ...
  ...
  MyTableDB: ToAssociation<models.MyTableDB>;
};
```
