# Biz Layer

Biz Layer aka Service Layer.

## General Info

### What is it?

Although it's being referred to as the Biz Layer, it's really more akin to a service layer. The directory `services` was already taken on implementation so `biz` was chosen.

In short, our Biz layer provides an abstraction over our business logic. It should not really care where or how our data is stored or retrieved from. All it does is performs operations on models depending on our business rules.

e.g. In the Biz layer, we encapsulate authorization such as "Super Admins can access resources across all tenants", "Owners can only query resources in their single tenant", or "Throw a 404 error if resource not found"

## Why use it?

Same as [DAO](./../dao/README.md#why-use-it), it follows the Single Responsibility Pattern (SRP). Our business rules should never care about where our data comes from, it's primary concern should be how to implement the business rules.

And with this entire layer separation, we can even move into a micro service architecture if the need ever arises. Everything is already encapsulated, without a direct file import link anywhere.

## Development

The following classes are classes you should be familiar with when working with Biz classes

### Biz

See [Biz.ts](./utils/Biz.ts). Not much going on, it only stores exceptions.

### Context

See [Context.ts](./utils/Context.ts).

### ContextQuery

See [ContextQuery.ts](./utils/ContextQuery.ts).

### Conventions

1. When creating a new Biz class, please follow the following naming conventions:

* **getAll** - finds all models by some context
* **getAllBy\<field>** - finds all models by some provided field
* **getAll\<predefined meaning>** - e.g. findAllPublic means to find all models that are public
* **get** - finds all models using pagination
* **getBy\<field>** - finds all models by a restriction using pagination
* **getOneBy\<field>** - finds a single model by using PK or unique key(s)
* **updateBy\<field>** - updates model(s) by using some field
* **deleteBy\<field>** - deletes model(s) by using some field

**Q**: Isn't `get` and `find` the same though?

**A**: A `get` method implies that the function will throw errors related to RESTful, e.g. throw an error if record is not found. Whereas `find`, implies it attempts to find a record and if not found, `null` is returned.

### Boilerplate

1. Add example class structure with basic functionality (you can also create the class without methods in case you want to skip this step)


```ts
export class MyTableBiz extends Biz {
  async get(
    override: UserQuery | undefined,
    pagination: Pagination,
    query: MyTableQueryBiz
  ) {
    const context = await this.userQuery.build(override);

    return this.services.dao.badge.find(context, pagination, query);
  }

  async getOneById(override: UserQuery | undefined, id: string) {
    const context = await this.userQuery.build(override);

    const model = await this.services.dao.myTable.findOneById(context, id);
    if (!model) {
      throw new this.exception.ResourceNotFound('model');
    }
    return model;
  }

  async create(override: TenantQuery | undefined, payload: MyTableModifyBiz) {
    const context = await this.tenantQuery.build(override);

    return this.services.dao.myTable.create({
      ...payload,
      tenant_id: context.tenantId,
    });
  }

  async updateById(
    override: UserQuery | undefined,
    id: string,
    payload: MyTableModifyBiz
  ) {
    const context = await this.userQuery.build(override);

    const model = await this.services.dao.myTable.updateById(
      context,
      id,
      payload
    );
    if (!model) {
      throw new this.exception.ResourceNotFound('model');
    }
    return model;
  }

  async deleteById(override: UserQuery | undefined, id: string) {
    // existence check
    await this.getOneById(override, id);

    // no need to do context check here, getOneById performs it
    await this.services.dao.myTable.deleteById({}, id);
  }
}
```

2. Add the new Biz file to [./index.ts](./index.ts). Keep the file alphabetized for consistency.

3. Add the new Biz class type to [./../middlewares/context/types.ts](./../middlewares/context/types.ts). Keep the file alphabetized for consistency.

```ts
export type ContextServices = {
  biz: {
    ...
    myTable: MyTableBiz;
    ...
  };
  dao: {
    ...
  };
};
```

4. Instantiate the Biz class in [./../middlewares/context/middleware.ts](./../middlewares/context/middleware.ts). Keep the file alphabetized for consistency.

```ts
  const services: ContextServices = {
    biz: {
      ...
      myTable: {} as any, // needed for guest access
      ...
    },
    dao: {
      ...
    },
  };

  if (req.user) {
    const db = (req as any).db as DB['models'];
    const bizOpts = {
      db,
      user: req.user,
      exception: (req as any).exception,
      services: services, // post assignment through reference
    };

    // dao classes

    ...
    services.biz.myTable = new MyTableDAO(bizOpts);
    ...
  }  
```
